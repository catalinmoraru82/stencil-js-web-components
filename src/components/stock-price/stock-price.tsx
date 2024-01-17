import { Component, State, h, Element, Prop, Watch } from "@stencil/core";
import { API_KEY } from "../../global/global";

@Component({
    tag: 'uc-stock-price',
    styleUrl: './stock-price.css',
    shadow: true
})
export class StockPrice {
    stockInput: HTMLInputElement;
    // initialStockSymbol: string;
    @State() fetchedPrice: number;
    @State() stockUserInput: string;
    @State() stockInputvalid = false;
    @State() error: string;
    @Element() el: HTMLElement;

    @Prop({mutable: true, reflect: true}) stockSymbol: string; //html attribute

    @Watch('stockSymbol')
    stockMethodChanged(newValue: string, oldValue: string){
        if(newValue !== oldValue) {
            this.stockUserInput = newValue;
            this.fetchStockPrice(newValue);
        }
    }

    onUserInput(event: Event) {
        this.stockUserInput = (event.target as HTMLInputElement).value;
        if(this.stockUserInput.trim() !== '') {
            this.stockInputvalid = true;
        } else {
            this.stockInputvalid = false;
        }
    }

    onFetchStockPrice(event: Event) {
        event.preventDefault();
        this.stockSymbol = this.stockInput.value;
    }

    componentDidLoad() {
        if (this.stockSymbol) {
            this.stockUserInput = this.stockSymbol;
            this.stockInputvalid = true;
            this.fetchStockPrice(this.stockSymbol)
        }
    }

    async fetchStockPrice(stockSymbol) {
        const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`);
        const parsedRes = await res.json();

        if(!parsedRes['Global Quote']['05. price']) {
            throw new Error('Invalid symbol');
        } else {
            this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
        }
    }

    render() {
        let dataContent = <p>Price: ${ this.fetchedPrice }</p>;

        if(this.error) {
            dataContent = <p>{this.error}</p>
        }

        return [
            <form onSubmit={ this.onFetchStockPrice.bind(this) }>
                <input  id='stock-symbol' type="text" ref={el => this.stockInput = el} value={this.stockUserInput} onInput={this.onUserInput.bind(this)}/>
                <button disabled={!this.stockInputvalid} type="submit">Fetch</button>
            </form>,
            <div>
                {dataContent}
            </div>
        ]
    }
}