import React from "react";
import antlr4 from "antlr4";
import CLexer from "./antlr/CLexer";
import "./App.css";

class Core extends React.Component {
    operatorsType = [ 65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 80, 81, 82, 89, 90, 91, 92, 93, 94, 97, 98, 99, 100, 101];

    program="asd \n asd";
    reader = new FileReader()

    constructor(props) {
        super(props);
        this.state = {
            code: "Proszę wczytać plik z rozszerzeniem C",
            numberOfOperators: 0,
            uniqueOperators: [],
            operators: [],
            numberOfOperands: 0,
            uniqueOperands: [],
            operands:[],
            halDctionary: 0,
            halLength: 0,
            halCapacity: 0,
            halDifficulty: 0,
            halWorkload: 0,
            halErrorsNum: 0
        }
        this.testtt="asd \n asd"
        this.onChange = this.onChange.bind(this)
        this.getParams = this.getParams.bind(this)
    }
    onChange(e){
        this.resetState();
        var file = e.target.files[0];
        this.reader.readAsText(file)
        this.reader.onload = () =>{
            this.setState({code: this.reader.result})

            var chars = new antlr4.InputStream(this.reader.result);
            var lexer = new CLexer(chars);
            var tokens = new antlr4.CommonTokenStream(lexer);
            tokens.fill();
            this.getParams(tokens.tokens)
            console.log(this.state)
        }
    }
    getParams(tokens){
        for(let i=0; i<tokens.length;i++){
               if (this.operatorsType.includes(tokens[i].type))
               {
                   this.setState(prevState => ({operators: [...prevState.operators, tokens[i].text]}))
                 if(tokens[i-1].type==105 || tokens[i-1].type==106 )
                    this.setState(prevState => ({operands: [...prevState.operands, tokens[i-1].text]}))
                 if(tokens[i+1].type==105 || tokens[i+1].type==106)
                    this.setState(prevState => ({operands: [...prevState.operands, tokens[i+1].text]}))
               }
            }
            this.setState({uniqueOperands: this.state.operands.filter(this.onlyUnique)})
            this.setState({uniqueOperators: this.state.operators.filter(this.onlyUnique)})
            this.setHalsteadParams()

    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    setHalsteadParams(){
        var I = this.state.uniqueOperators.length+this.state.uniqueOperands.length;
        var L = this.state.operators.length+this.state.operands.length;
        console.log(I + " " + L)
        var V = L * Math.log2(I);
        console.log("V "+ V)
        var T = (this.state.uniqueOperators.length*this.state.operands.length) / (2*this.state.uniqueOperands.length)
        console.log("T "+ T)
        var E = V*T;
        console.log("E "+ E)
        var N = V/3000;
        console.log("N "+ N)
        this.setState({
            halDctionary: I,
            halLength: L,
            halCapacity: V,
            halDifficulty: T,
            halWorkload: E,
            halErrorsNum: N

        })
        console.log(this.state)
    }

    resetState() {
        this.setState({
            code: "",
            numberOfOperators: 0,
            uniqueOperators: [],
            operators: [],
            numberOfOperands: 0,
            uniqueOperands: [],
            operands:[],
            halDctionary: 0,
            halLength: 0,
            halCapacity: 0,
            halDifficulty: 0,
            halWorkload: 0,
            halErrorsNum: 0
        })
    }

    render() {
      return (
      <div className="wrapper">
          <div className="header">
            <div className="headerBlock">
                <div className="headerBlock__title">
                    Aplikacja do wyznaczania miar Halsteada na podstawie zewnętrznego pliku napisanego w języku C
                </div>
                <div className="buttonDiv">
                    <input class="button" type="file" accept=".c" name="name" onChange={this.onChange} />
                </div>
            </div>
          </div>
          <div className="body">
                <div className="block">
                    <div className="block__title">
                        Kod wczytanego programu
                    </div>
                    <div className="block__content">
                        <div style={{whiteSpace: "pre-wrap"}}>{this.state.code}</div>
                    </div>
                </div>
                <div className="block">
                    <div className="block__title">
                        Unikalne operatory 
                    </div>
                    <div className="block__content">
                        {this.state.uniqueOperators.map(x => (
                        <li>{x}</li> 
                        )
                           
                        )}
                    </div>
                    
                    <div className="block__title">
                        Unikalne operandy 
                    </div>
                    <div className="block__content">
                        {this.state.uniqueOperands.map(x => (
                            <li>{x}</li>
                        ))}
                    </div>
                </div>
                <div className="block">
                    <div className="block__title">
                        Miary złożoności programu
                    </div>
                    <div className="block__content">
                        Liczba różnych operatorów: {this.state.uniqueOperators.length}<br/>
                        Liczba różnych operandów: {this.state.uniqueOperands.length}<br/>
                        Łączna liczba operatorów: {this.state.operators.length}<br/>
                        Łączna liczba operandów: {this.state.operands.length}<br/>
                        Słownik programu: {this.state.halDctionary}<br/>
                        Długość programu: {this.state.halLength}<br/>
                        Objętość programu: {this.state.halCapacity}<br/>
                        Trudność programu: {this.state.halDifficulty}<br/>
                        Wymagany nakład pracy: {this.state.halWorkload}<br/>
                        Przewidywalna liczba błędów: {this.state.halErrorsNum}<br/>
                    </div>
                </div>
          </div>
      </div>);
    }
  }

export default Core