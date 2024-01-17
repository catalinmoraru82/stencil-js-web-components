import { Component, State, h, Element, Prop, Watch } from "@stencil/core";
import { API_KEY } from "../../global/global";


@Component({
    tag: 'uc-stock-finder',
    styleUrl: './stock-finder.css',
    shadow: true
})
export class StockFinder {
    stockNameInput: HTMLInputElement;

    @State() searchResults: {symbol: string, name: string}[] = [];

    //https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo
    async onFindStocks(event: Event) {
        event.preventDefault();
        const stockName = this.stockNameInput.value;

        const res = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${API_KEY}`);
        const parsedRes = await res.json();
        this.searchResults = parsedRes['bestMatches'].map(match => {
            return {
                symbol: match['1. symbol'],
                name: match['2. name'],
            }
        })
        console.log(this.searchResults)
    }

    render(){
        return [
            <form onSubmit={this.onFindStocks.bind(this)}>
                <input  id='stock-symbol' type="text" ref={el => this.stockNameInput = el} />
                <button type="submit">Find</button>
            </form>,
            <ul>
                {this.searchResults.map(result => {
                    return <li><strong>{result.symbol}</strong> - {result.name}</li>
                })}
            </ul>
        ];
    }
}