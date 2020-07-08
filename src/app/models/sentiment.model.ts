export class Sentiment {
    public stop_id : number;
    public route_type : number;
    public route_id : number;
    public direction_id : number;
    public run_id : number;
    public vibe : number;
    public capacity: number;

    //Labels
    public stop_name : string;
    public route_number : string;
    public direction : string;
    public departure_time : Date;
    public at_platform : boolean;
    public platform_number : string;
}