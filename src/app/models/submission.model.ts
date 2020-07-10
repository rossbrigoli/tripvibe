import { Sentiment } from './sentiment.model';
import { Submitter } from './submitter.model';

export class Submission {
    public sentiment : Sentiment;
    public submitter : Submitter;
    public location_lat : number;
    public location_lng : number;
}