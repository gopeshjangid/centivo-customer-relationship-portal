import { BrowserRouter } from 'react-router-dom';
import {serviceAPI} from './service.api';

export const Router = BrowserRouter;
export const api = serviceAPI;
export * from './token';
export * from './service';