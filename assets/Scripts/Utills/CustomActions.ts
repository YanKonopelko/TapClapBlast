export class CustomAction {
    protected allListeners: { func: CallableFunction, component: any }[] = [];

    public Subscribe(cb: CallableFunction, component: any): void {
        this.allListeners.push({ func: cb, component: component });

    }
    public UnSubscribe(cb: CallableFunction, component: any): void {
        for (let i = this.allListeners.length - 1; i >= 0; i--) {
            var a = this.allListeners[i];
            if (a.component == component && a.func == cb) {
                this.allListeners.remove(a);
            }
        }
    }
    public Invoke(...params: any[]): void {
        for (let i = 0; i < this.allListeners.length; i++) {
            let listener = this.allListeners[i];
            listener.func.bind(listener.component)();
        }
    }

}

export class CustomActionWithParam<T1> extends CustomAction {
    public Invoke(param: T1): void {
        for (let i = 0; i < this.allListeners.length; i++) {
            let listener = this.allListeners[i];
            listener.func.bind(listener.component)(param);
        }
    }
}
export class CustomActionWithTwoParam<T1, T2> extends CustomAction {
    public Invoke(param_1: T1, param_2: T2): void {
        for (let i = 0; i < this.allListeners.length; i++) {
            let listener = this.allListeners[i];
            listener.func.bind(listener.component)(param_1, param_2);
        }
    }
}
export class CustomActionWithThreeParam<T1, T2, T3> extends CustomAction {
    public Invoke(param_1: T1, param_2: T2, param_3: T3): void {
        for (let i = 0; i < this.allListeners.length; i++) {
            let listener = this.allListeners[i];
            listener.func.bind(listener.component)(param_1, param_2, param_3);
        }
    }
}
export class CustomActionWithFourParam<T1, T2, T3, T4> extends CustomAction {
    public Invoke(param_1: T1, param_2: T2, param_3: T3, param_4: T4): void {
        for (let i = 0; i < this.allListeners.length; i++) {
            let listener = this.allListeners[i];
            listener.func.bind(listener.component)(param_1, param_2, param_3, param_4);
        }
    }
}