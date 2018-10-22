export interface Place {
    name: string;
    image: string;
    address: string;
    rating: number;    
    id: string;
    going?: Array<string>;    
    goingLabel?: string;
    _id: string; //_id from MongoDB
}
