import { GenericFormatter } from "../GenericFormatter";
import { ChallengeSet } from "../../models/challenge-set";

export class XAccuracyStarsFormatter extends GenericFormatter<ChallengeSet> {
  format(data: ChallengeSet): any {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      shortName: 'PP W/ Acc',
      description: 'Get PP on either service while keeping accuracy',
      image: data.image,
      resetTime: data.resetTime,
      difficulties: data.difficulties.map(function(diff : any) {
          return {
              challengeSet: diff.challengeSet,
              name: diff.difficulty,
              value: "<line-height=70%><color=#FFAAAA>BL: " + diff.values.bl[0] + " PP<br><color=#FFFF55>SS: " + diff.values.ss[0] + " PP<br><color=#5555FF>ACC: " + diff.values.bl[1] + "%"
          }
      })
    }
  }
}