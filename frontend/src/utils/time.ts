
export const timeDifferenceString = (timeStamp: Date):string => {

    const timeNow = new Date();

    const difference =  (timeNow.getTime()-timeStamp.getTime())/1000;

    if (difference < 60 ) {
        return "now"
    } else if ( difference >= 60 && (difference/60) < 60) {
        const min = Math.trunc(difference/60)
        return min === 1 ?`${min} minute` : `${min} minutes`
    } else if ( (difference/60) >= 60 && (difference/(60*60)) < 24) {
        const hour = Math.trunc(difference/(60*60))
        return hour === 1 ?`${hour} hour` : `${hour} hours`
    } else if ((difference/(60*60)) >=24 && (difference/(60*60*24)) < 7) {
        const day = Math.trunc(difference/(60*60*24))
        return day === 1 ?`${day} day` : `${day} days`
    } else if ((difference/(60*60*24)) >= 7 && (difference/(60*60*24*7)) <52) {
        const week = Math.trunc(difference/(60*60*24*7))
        return week === 1 ?`${week} week` : `${week} weeks`
    } else {
        const year = Math.trunc(difference/(60*60*24*7*52))
        return year === 1 ?`${year} year` : `${year} years`
    }
        return ""
}