import * as React from 'react';
import {User} from './Api/Hub/Models/Users';

export const UserContext = React.createContext<User | null>(null);
UserContext.displayName = 'UserContext';
