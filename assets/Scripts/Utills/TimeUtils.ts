export class TimeUtils {
    public static readonly MS_IN_DAY: number = 86400000;
    public static readonly MS_IN_HOUR: number = 3600000;
    public static readonly MS_IN_MIN: number = 60000;
    public static readonly MS_IN_SEC: number = 1000;


    public static Timeout(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static TimeoutSeconds(s: number) {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
    }

    public static WaitUntil(fn: () => boolean): Promise<void> {
        let checkDone = (onDone: () => void) => {
            setTimeout(() => {
                if (fn())
                    onDone();
                else
                    checkDone(onDone)
            })
        }
        return new Promise<void>((resolve, reject) => {
            checkDone(resolve)
        })
    }
}