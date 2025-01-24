import { Component } from '@angular/core';
import { TitleBackendAppComponent } from '../../../components/backend/title/index.component';
import {
  TableBackendAppComponent,
  TColumn,
} from '../../../components/backend/table/index.component';
import { DialogUserAppComponent } from './dialog/index.component';

type TUser = {
  _id: string;
  isActive: boolean;
  picture: string;
  name: string;
  gender: string;
  company: string;
  email: string;
  phone: string;
  favoriteFruit: string;
};

const users: TUser[] = [
  {
    _id: '679309d25474a8cb5c6bd368',
    isActive: false,
    picture: 'https://api.dicebear.com/9.x/adventurer/svg?seed=1',
    name: 'Owens Allison',
    gender: 'male',
    company: 'TELLIFLY',
    email: 'owensallison@tellifly.com',
    phone: '+1 (873) 597-3839',
    favoriteFruit: 'strawberry',
  },
  {
    _id: '679309d28708439bf04a550f',
    isActive: true,
    picture: 'https://api.dicebear.com/9.x/adventurer/svg?seed=2',
    name: 'Howard Horn',
    gender: 'male',
    company: 'PAWNAGRA',
    email: 'howardhorn@pawnagra.com',
    phone: '+1 (869) 492-3936',
    favoriteFruit: 'banana',
  },
  {
    _id: '679309d26e0880a2e0a16233',
    isActive: true,
    picture: 'https://api.dicebear.com/9.x/adventurer/svg?seed=3',
    name: 'Kim Roy',
    gender: 'female',
    company: 'ISOSWITCH',
    email: 'kimroy@isoswitch.com',
    phone: '+1 (873) 590-3750',
    favoriteFruit: 'strawberry',
  },
  {
    _id: '679309d23dfbff87258660a0',
    isActive: false,
    picture: 'https://api.dicebear.com/9.x/adventurer/svg?seed=4',
    name: 'Glenda Tate',
    gender: 'female',
    company: 'AVENETRO',
    email: 'glendatate@avenetro.com',
    phone: '+1 (845) 568-2680',
    favoriteFruit: 'apple',
  },
  {
    _id: '679309d2e849ee6c1d1a570f',
    isActive: true,
    picture: 'https://api.dicebear.com/9.x/adventurer/svg?seed=15',
    name: 'Rowena Browning',
    gender: 'female',
    company: 'DOGNOST',
    email: 'rowenabrowning@dognost.com',
    phone: '+1 (989) 583-3265',
    favoriteFruit: 'banana',
  },
  {
    _id: '679309d21ffe46ab37e15959',
    isActive: false,
    picture: 'https://api.dicebear.com/9.x/adventurer/svg?seed=16',
    name: 'Ayers Henry',
    gender: 'male',
    company: 'GEOFARM',
    email: 'ayershenry@geofarm.com',
    phone: '+1 (974) 509-2211',
    favoriteFruit: 'banana',
  },
];

@Component({
  selector: 'user-page-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [TitleBackendAppComponent, TableBackendAppComponent, DialogUserAppComponent],
})
export class UserPageApp {
  dataTitle = {
    title: 'User',
    subtitle: 'You can manage user here.',
    link: '/admin/user/add',
  };

  data: TUser[] = users;
  columns: TColumn<TUser>[] = [
    {
      columnDef: '_id',
      header: 'ID',
      cell: (element: TUser) => `${element._id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: TUser) => `${element.name}`,
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: TUser) => `${element.email}`,
    },
    {
      columnDef: 'picture',
      header: 'Picture',
      isImage: true,
      cell: (element: TUser) => [element.picture, 45, 45],
    },
    // {
    //   columnDef: 'action',
    //   header: 'Action',
    //   isAction: true,
    //   cell: (element: TUser) => [
    //     () => `edit trigger ${element._id}`,
    //     () => `delete trigger ${element._id}`
    //   ]
    // }
  ];
}
