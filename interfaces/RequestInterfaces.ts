import { CardType } from "./CardContainerInterfaces"


export interface Request {
    id: string,
    header: string,
    footer: string,
    extraClass: string,
    content: any
    type: CardType
}
  