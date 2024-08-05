import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { Friendship } from 'src/friendship/entities/friendship.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Friendship)
    private readonly friendShipRepository: Repository<Friendship>
  ) { }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = parseInt(process.env.SALTORROUNDS)

    const password = createUserDto.password.toString();

    const passwordHashed = await bcrypt.hash(password, saltOrRounds);

    createUserDto.password = passwordHashed
    const avatars=[
      'https://res.cloudinary.com/delivery-food/image/upload/v1721319651/red-panda_oexsx7.png',
      'https://res.cloudinary.com/delivery-food/image/upload/v1721319685/penguin_j3zp9q.png',
      'https://res.cloudinary.com/delivery-food/image/upload/v1721319671/panda_z7n43l.png'
    ]
    if(!createUserDto.avatar){
      createUserDto.avatar=avatars[Math.floor(Math.random() * avatars.length) ]
    }
    if(!createUserDto.background){
      createUserDto.background='https://res.cloudinary.com/delivery-food/image/upload/v1722530656/z5690548315368_5805bf08ee84b9e48529ddc376da128c_fb0qke.jpg'
    }
    return await this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(user_id: number, request: Request): Promise<User | null> {
    //get id of user request
    const user_req = request.headers[USER_ID_HEADER_NAME]

    //get user
    const userQuery = await this.userRepository.findOne({
      where: {
        id: user_id
      }
    });

    // // lấy danh sách bạn bè của user   
    const friendOfUser = await this.friendShipRepository
      .createQueryBuilder('f')
      .where(
        `user1=:user_id AND user2=:user_req`, { user_req: user_req, user_id: user_id }
      )
      .orWhere(
        ` user1=:user_req AND user2=:user_id`, { user_req: user_req, user_id: user_id }
      )
      .getOne()

    //lọc id bạn bè của user
    const statusFriend = this.FilterStatusFriend(user_req, friendOfUser)

    userQuery['relationship'] = statusFriend
    return userQuery
  }

  async findUserByEmail(email: string): Promise<User | null | any> {
    return await this.userRepository.findOneBy({ email: email });
  }

  async historyActivitiy(request: Request): Promise<User | any> {
    try {
      //get user from token
      const user_id = request.headers[USER_ID_HEADER_NAME];

      const historyLikes = await this.userRepository
        .createQueryBuilder('u')
        //joinlikePost
        .leftJoin('u.likePosts', 'lp')
        .addSelect(['lp.reaction', 'lp.create_at', 'lp.update_at'])
        .orderBy('lp.create_at','DESC')

        //joinPost
        .leftJoinAndSelect('lp.posts', 'posts')
        .leftJoin('posts.creater', 'creater')
        .addSelect(['creater.fullname', 'creater.id'])
        .orderBy('posts.create_at','DESC')


        //join like comment
        .leftJoinAndSelect('u.likeComments', 'lc')
        .leftJoin('lc.user', 'uLikeC')
        .addSelect(['uLikeC.fullname', 'uLikeC.id'])
        .orderBy('lc.create_at','DESC')

        //join comment
        .leftJoinAndSelect('u.comments', 'comment')
        .leftJoinAndSelect('comment.posts', 'pComment')
        .leftJoin('pComment.creater', 'pComment_Creater')
        .addSelect(['pComment_Creater.fullname', 'pComment_Creater.id'])
        .orderBy('comment.create_at','DESC')

        .where({
          id: user_id
        })
        
        .getOne()

      historyLikes.password = undefined

      return historyLikes;
    } catch (error) {
      return {
        status: -1,
        message: '' + error
      }
    }
  }

  async checkOnline(user_id:number){
    const user= await this.userRepository.findOne({where:{id:user_id}})
    return {
      online:user.online
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id: id })

      await this.userRepository.save({
        ...user,
        ...updateUserDto
      })

      return {
        status: 1,
        message: "OK"
      }
    } catch (error) {
      return {
        status: -1,
        message: error
      }
    }

  }

  async remove(id: number): Promise<any> {

    try {
      await this.userRepository.delete(id);

      return {
        status: 1,
        message: "OK"
      }
    } catch (error) {
      return {
        status: -1,
        message: error
      }
    }
  }

  async search(keyword: string, request: Request) {
    //get id of user request
    const user_req = request.headers[USER_ID_HEADER_NAME]

    // // lấy danh sách bạn bè của user   
    const friendOfUser = await this.friendShipRepository
      .createQueryBuilder('f')
      .where({
        user1: user_req
      })
      .orWhere({
        user2: user_req
      }).getMany()

    // //lọc id bạn bè của user
    const friendOfUsers = friendOfUser.map(f => {
      return this.FilterStatusFriend(user_req, f)
    })

    // lấy danh sách bạn bè của user
    const resultUserFinded = await this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.fullname', 'u.avatar'])
      .where(
        `u.fullname LIKE '%${keyword}%'`
      )
      .getMany()

    //lấy danh sách mối quan hệ giữa người dùng và người tìm được

    friendOfUsers.forEach((f) => {
      const index = resultUserFinded.findIndex(r => r.id === f.user)

      if (index !== -1) {
        if (f.status === 1) {
          resultUserFinded[index]['relationship'] = {
            status: f.status,
            user_req: f.user_req
          }
          return
        }
        resultUserFinded[index]['relationship'] = {
          status: f.status,
        }
      }
    })

    return resultUserFinded;
  }

  FilterStatusFriend(user_req: number, f: any) {
    if (f === null) return null;

    const { user1, user2, status } = f
    if (user1 === user_req) {
      if (status == 1) {
        return {
          user: user2,
          status,
          user_req: user1
        }
      }
      return {
        user: user2,
        status
      }
    }
    if (status == 1) {
      return {
        user: user1,
        status,
        user_req: user1
      }
    }
    return {
      user: user1,
      status
    }
  }
}
