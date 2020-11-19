import { AxiosResponse } from "axios";

export interface HttpResponse<T> extends Promise<void | AxiosResponse<T>>{
}
