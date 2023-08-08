import { GenericFormatter } from "./GenericFormatter";
import { Formatter } from "./Formatter";
import { XAccuracyStarsFormatter } from "./challenges/XAccuracyStarsFormatter";
import { ChallengeSet } from "../models/challenge-set";

export class FormatterFactory {
  createFormatter(formatName: string): Formatter<ChallengeSet> {
	if (formatName === 'xAccuracyStars') {
	  return new XAccuracyStarsFormatter();
	}
	// Add more conditions to create other formatter types if needed
	
	return new GenericFormatter<ChallengeSet>();
  }
}