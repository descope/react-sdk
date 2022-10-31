import React from 'react';
import { IAuthContext } from '../types';

const AuthContext = React.createContext<IAuthContext>(undefined);

export default AuthContext;
