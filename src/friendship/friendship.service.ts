import { Injectable } from '@nestjs/common';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipDto } from './dto/update-friendship.dto';
import { USER_ID_HEADER_NAME } from 'src/auth/constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Friendship } from './entities/friendship.entity';
import { Request } from 'express';

const STATUS_FRIENDED = 2
const STATUS_REQUEST_FRIENDED = 1

@Injectable()
export class FriendshipService {

  constructor(
    @InjectRepository(Friendship)
    private readonly friendShipRepository: Repository<Friendship>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createFriendshipDto: CreateFriendshipDto, request: Request) {
    try {
      const user_req = request.headers[USER_ID_HEADER_NAME]
      const friendship= await this.friendShipRepository.findOne({
        where:{
          user1:parseInt(user_req.toString()),
          user2:createFriendshipDto['user2']
        }
      })
      if(friendship) {
        return {
          status:-1,
          message:"Exist"
        }
      }
        
      createFriendshipDto["user1"] = parseInt(user_req.toString())
      createFriendshipDto["status"]=1
      return await this.friendShipRepository.save(createFriendshipDto)
    } catch (error) {
      return {
        status:-1,
        message:""+error
      }
    }

  }

  async friends(request: Request, body: any): Promise<Friendship[]> {
    const user_req = request.headers[USER_ID_HEADER_NAME]
    const { status } = body

    const query = await this.friendShipRepository
      .createQueryBuilder('f')
      .leftJoin('f.user2', 'user2')
      .addSelect(['user2.id', 'user2.fullname', 'user2.avatar','user2.dateOfBirth'])
      .leftJoin('f.user1', 'user1')
      .addSelect(['user1.id', 'user1.fullname', 'user1.avatar','user1.dateOfBirth'])
      //case user request make friend
      .where({
        status: status
      })
      .andWhere({
        user1: user_req
      })
      //case user is friend
      .orWhere({
        ...(status === 2 ? {
          user2: user_req,
          status: status
        } : {
          user1: user_req,
          status: status
        })
      })
      .getMany()

    //xóa thông tin user_req, đổi tên thành user
    query.map((f) => {
      if (f.user1['id'] === user_req) {
        const user = f.user2
        f['user'] = user
        f.user2 = undefined
        f.user1 = undefined
        return f
      }
      else {
        const user = f.user1
        f['user'] = user
        f.user2 = undefined
        f.user1 = undefined
        return f
      }
    })

    return query;
  }

  async receiveRequestFriend(request: Request) {
    const user_req = request.headers[USER_ID_HEADER_NAME]

    const query = await this.friendShipRepository
      .createQueryBuilder('f')
      .leftJoin('f.user1', 'user1')
      .addSelect(['user1.id', 'user1.fullname', 'user1.avatar'])
      //case user request make friend
      .where({
        status: 1
      })
      .andWhere({
        user2: user_req
      })
      .getMany()

    //xóa thông tin user_req, đổi tên thành user

    query.map((f) => {
      const user = f.user1
      f['user'] = user
      f.user1 = undefined
      f.user2 = undefined
      return f

    })
    return query;
  }

  //goi y ket ban
  async recommend(request: Request): Promise<User[]> {

    const user_req = request.headers[USER_ID_HEADER_NAME]
    try {
      // lấy danh sách bạn bè của user   
      const friendOfUser = await this.friendShipRepository
        .createQueryBuilder('f')
        .where({
          status: 2,
          user1: user_req
        })
        .orWhere({
          status: 2,
          user2: user_req
        }).getMany()

      //lọc id bạn bè của user
      const idfriendOfUsers = friendOfUser.map(f => {
        if (f.user1 === parseInt(user_req.toString())) {
          return f.user2
        }
        return f.user1
      })

      //lấy ds bạn bè của bạn bè user
      const friendOfFriendUsers = await this.friendShipRepository
        .createQueryBuilder('f')
        .where('f.status = 2 AND f.user1 IN (:...ids) AND f.user2 != :id ', { ids: idfriendOfUsers, id: user_req })
        .orWhere('f.status = 2 AND f.user2 IN (:...ids) AND f.user1 != :id', { ids: idfriendOfUsers, id: user_req })
        .getMany()

      //lọc id bạn bè của user
      const idfriendOfFriendUsers = friendOfFriendUsers.map(f => {
        return [f.user1, f.user2]
      }).flat()


      // lấy danh sách đã yêu cầu của user   
      const userRequestedFriend = await this.friendShipRepository
        .createQueryBuilder('f')
        .where({
          status: STATUS_REQUEST_FRIENDED,
          user1: user_req
        })
        .orWhere({
          status: STATUS_REQUEST_FRIENDED,
          user2: user_req
        }).getMany()

       //lọc id yêu cầu của user
      const idUserRequestedFriend = userRequestedFriend.map(f => {
        if (f.user1 === parseInt(user_req.toString())) {
          return f.user2
        }
        return f.user1
      }) 

      //lọc id khác với id bạn bè của user
      const idUserCommned = [...new Set(idfriendOfFriendUsers)].filter(id => {
        return !idfriendOfUsers.includes(id) && !idUserRequestedFriend.includes(id)
      })

      const userCommend = await this.userRepository.
        createQueryBuilder('u')
        .select(['u.id', 'u.fullname', 'u.avatar'])
        .where(
          `u.id IN (:...ids)`, { ids: idUserCommned }
        )
        .getMany()
      return userCommend
    } catch (error) {
      return []
    }

  }


  async unFriendShip(body: any) {
    try {
      const { user1, user2 } = body
      await this.friendShipRepository
      .createQueryBuilder()
      .delete()
      .from(Friendship)
      .where({
        user1: user1,
        user2: user2,
        status:2
      })
      .orWhere(
        {
          user1: user2,
          user2: user1,
          status:2
        }
      )
      .execute()
      return {
        status: 1,
        message: "Cancle Success"
      }
    } catch (error) {
      return {
        status: 2,
        message: "Cancle Failed" + error
      }
    }
  }

  async cancleRequest(body:any,request:Request) {
    const user_req= request.headers[USER_ID_HEADER_NAME]
    try {
      const { user2 } = body
      await this.friendShipRepository.delete({
        user1: parseInt(user_req.toString()),
        user2: user2,
        status:1
      })
      return {
        status: 1,
        message: "Cancle Success"
      }
    } catch (error) {
      return {
        status: -1,
        message: "Cancle Failed-" + error
      }
    }
  }

  async rejectRequest(body:any,request:Request) {
    const user_req= request.headers[USER_ID_HEADER_NAME]
    try {
      const { user1 } = body
      await this.friendShipRepository.delete({
        user1: user1,
        user2: parseInt(user_req.toString()),
        status:1
      })
      return {
        status: 1,
        message: "Reject Success"
      }
    } catch (error) {
      return {
        status: -1,
        message: "Reject Failed-" + error
      }
    }
  }

  async acceptRequest(body:any,request:Request) {
    const user_req= request.headers[USER_ID_HEADER_NAME]
    try {
      const { user1 } = body
      const friendship=await this.friendShipRepository.findOne({
        where:{
          user1: user1,
          user2: parseInt(user_req.toString()), 
        }
        
      })

      await this.friendShipRepository.save({
        ...friendship,
        status:2
      })
      return {
        status: 1,
        message: "Reject Success"
      }
    } catch (error) {
      return {
        status: -1,
        message: "Reject Failed-" + error
      }
    }
  }

  async search(keyword: string, request: Request) {
    //get id of user request
    const user_req = request.headers[USER_ID_HEADER_NAME]

    // lấy danh sách bạn bè của user   
    const friendOfUser = await this.friendShipRepository
      .createQueryBuilder('f')
      .where({
        status: 2,
        user1: user_req
      })
      .orWhere({
        status: 2,
        user2: user_req
      }).getMany()

    //lọc id bạn bè của user
    const idfriendOfUsers = friendOfUser.map(f => {
      if (f.user1 === parseInt(user_req.toString())) {
        return f.user2
      }
      return f.user1
    })

    if (idfriendOfUsers.length <= 0) {
      return []
    }

    // lấy danh sách bạn bè của user    
    const resultFinded = await this.userRepository.
      createQueryBuilder('u')
      .select(['u.id', 'u.fullname', 'u.avatar'])
      .where(
        `u.id IN (:...ids) AND u.fullname LIKE '%${keyword}%'`, { ids: idfriendOfUsers }
      )
      .getMany()
    return resultFinded;
  }

}
