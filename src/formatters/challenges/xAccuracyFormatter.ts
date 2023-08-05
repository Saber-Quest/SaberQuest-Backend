//TODO: Create Formatter interface 

export class xAccuracyFormatter {
    //TODO: Use DB Table for static visual information
    static format(object: any): any {
        return {
            id: object.id,
            name: object.name,
            type: object.type,
            shortName: 'PP W/ Acc',
            description: 'Get PP on either service while keeping accuracy',
            image: object.image,
            resetTime: object.resetTime,
            difficulties: object.difficulties.map(function(diff : any) {
                return {
                    challengeSet: diff.challengeSet,
                    name: diff.difficulty,
                    //TODO: string format
                    value: "<line-height=70%><color=#FFAAAA>BL: " + diff.values.bl[0] + " PP<br><color=#FFFF55>SS: " + diff.values.ss[0] + " PP<br><color=#5555FF>ACC: " + diff.values.bl[1] + "%"
                }
            })
        }
    }
}