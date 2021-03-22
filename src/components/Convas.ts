import {Component, Vue, Watch} from 'vue-property-decorator';
import WithRender from './convas.html';

@WithRender
@Component
export default class Convas extends Vue {
    public form: object = {
        name: '',
        selected: 'A',
        file: {
            url: ''
        }
    };

    public mouse: object = {
        x: 0,
        y: 0,
        canvas: 'A'
    };

    public objects: Array<object> = [];
    public logs: Array<string> = [];

    public selected: any = false;
    public selectedI: number = 0;

    public onSubmit(event: any): void {
        let obj: Obj = new Obj(this.form.selected, this.form.file.url, this.form.name);
        this.objects.push(obj)

        let data: string = new Date().toLocaleTimeString();
        let numContainer: number = this.numContainer(this.form.file.url);

        this.logs.push("<span class='data'>[" + data + "]</span> - <span class='obj_name'>Object " + this.objects.length + "</span> added to <span class='container_name'>Container " + numContainer + "</span>");
    };

    public clear(): void {
        for(let i=0; i<this.objects.length; i++) {
            // @ts-ignore
            this.objects[i].clear();
        }

        this.objects = [];
    };

    public handleFileUpload(e: any): void {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;

        for(let i=0; i<files.length; i++) {
            let reader = new FileReader();
            reader.onload = () => {
                this.form.file.url = reader.result;
            };
            reader.readAsDataURL(files[i]);
        }
    };

    public update(): void {
        for(let i=0; i<this.objects.length; i++) {
            this.objects[i].reDraw();
        }
    }

    private autoSaveInterval: number = setInterval( ()=>{
        this.update();
    },50);

    public mousemove(e: MouseEvent){
        let el = document.getElementById("C") as HTMLElement;
        el.style.top = e.pageY + 5 + "px";
        el.style.left = e.pageX + 5 + "px";
    };

    public mousedown(e: MouseEvent){
        for(let i=0; i<this.objects.length; i++) {
            if (this.isCursorInRect(this.objects[i])) {
                let el = document.getElementById("C") as HTMLCanvasElement;
                el.style.display = "block";
                el.getContext("2d").clearRect(0,0,el.width, el.height);
                new Obj("C", this.objects[i].IMG, 0, 0, this.objects[i].name);
            }
        }
    }

    public mouseup(e: MouseEvent){
        let el = document.getElementById("C") as HTMLCanvasElement;
        el.getContext("2d").clearRect(0,0,el.width, el.height);
        el.style.display = "none";
    }

    public move(e: MouseEvent) {
        this.mouse.x = e.layerX;
        this.mouse.y = e.layerY;
        this.mouse.canvas = e.srcElement.id;

        if(this.selected){
            this.selected.clear();
            this.update();
        }
    };

    public down(e: MouseEvent){
        for(let i=0; i<this.objects.length; i++) {
            if (this.isCursorInRect(this.objects[i])) {
                this.selected = this.objects[i];
                this.selectedI = i;
                this.selected.transparent(true);
            }
        }
    };

    public up(e: MouseEvent){
        if(this.selected) {
            if(this.selected.canvas.id != e.srcElement.id){
                let obj: Obj = new Obj(e.srcElement.id, this.selected.IMG, this.mouse.x, this.mouse.y, this.selected.name);
                this.objects.push(obj);
                this.objects.splice(this.selectedI,1);

                let data: string = new Date().toLocaleTimeString();
                let from: number;
                let to: number;
                if(this.selected.canvas.id == 'A'){
                    from = 1;
                    to = 2;
                }else {
                    from = 2;
                    to = 1;
                }

                this.logs.push("<span class='data'>[" + data + "]</span> - <span class='obj_name'>Object " + (this.selectedI + 1) + "</span> moved from <span class='container_name'>Container " + from + "</span> to <span class='container_name'>Container " + to + "</span>");
            }else {
                this.selected.draw(this.mouse.x, this.mouse.y);
            }

            this.selected.transparent(false);
            this.selected.clear();
        }

        this.selected = false;
    };

    public numContainer(canvasId: string): number{
        let numContainer: number;
        if(canvasId == 'A'){
            numContainer = 1;
        }else {
            numContainer = 2;
        }

        return numContainer;
    };

    @Watch('isCursorInRect')
    isCursorInRect(obj: object) {
        return this.mouse.x > obj.X && this.mouse.x < obj.X + obj.W && this.mouse.y > obj.Y && this.mouse.y < obj.Y + obj.H && this.mouse.canvas == obj.canvas.id;
    };
}

class Obj {
    public canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private name: string = 'Object';
    private X: number = -1;
    private Y: number = -1;
    private W: number = 50;
    private H: number = 50;
    private IMG: string;
    private opacity: boolean = false;

    constructor(canvasId: string, img: string, name: string, x: number = -1, y: number = -1) {
        let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        let context = canvas.getContext("2d");

        this.canvas = canvas;
        this.context = context;
        this.name = name;

        this.IMG = img;

        this.draw(x, y);
    }

    private draw(x: number = -1, y: number = -1, w: number = 50, h: number = 50) {
        let canvas = this.canvas;
        let context = this.context;

        if(x == -1 || y == -1) {
            let cw = canvas.getBoundingClientRect().width - 100;
            let ch = canvas.getBoundingClientRect().height - 100;
            x = Math.floor(Math.random() * Math.floor(cw));
            y = Math.floor(Math.random() * Math.floor(ch));
        }

        var img = new Image();
        img.onload = function() {
            context.drawImage(img, x, y, w, h);
        };
        img.src = this.IMG;
        img.alt = this.name;

        this.X = x;
        this.Y = y;
        this.W = w;
        this.H = h;
    }

    private reDraw() {
        let context = this.context;

        if(this.opacity){
            context.globalAlpha = 0.3;
        }else{
            context.globalAlpha = 1;
        }

        var img = new Image();
        img.src = this.IMG;
        img.alt = this.name;
        context.drawImage(img, this.X, this.Y, this.W, this.H);
    }

    private transparent(toggle: boolean) {
        this.opacity = toggle;
    }

    private clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}