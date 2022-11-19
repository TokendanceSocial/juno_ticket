/**
 * 用户信息userInfo，票据信息
 * 
 * 
 */
 import User from './user';
 import Ticket from './ticket';
 
 export interface Stores {
   user: User;
   tickets: Ticket;
 }
 
 const stores : Stores = {
   user: new User(),
   tickets: new Ticket(),
 };
 
 export default stores;
