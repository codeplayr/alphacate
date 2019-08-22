# Alphacate

---

A little Node.JS toolkit with various indicators and oscillators for the technical stock analysis


**Important Notes**

This package is currently in an early state of development and **not** production ready. Use at your own risk.


## Example

---

```js
//retrieve indicator module via accessor
const LWMA = require('./index').LWMA;       

//pass optional configuration into constructor
let lwma = new LWMA( {periods: 4} );        

//insert data series
lwma.setValues( [10, 15, 16, 18, 20, 18, 17] );                     

try[
    //invoke calculate() to compute and retrieve result
    //error will be throw on invalid data or options
    let results = lwma.calculate();         
    console.log(results);                       
}
catch( Error e ){
    console.log(e.message);
}
```



### List of indicators

---

See the list below for all available indicators in the package. Retrieve the indicator module via the accessor property or with the alias.


Indicator                               |Module accessor               		|Alias              
----------------------------------------|-----------------------------------|-----------	
Average True Range                      |averageTrueRange                   |ATR                
Bollinger Bands                         |bollingerBands                     |BB                 
Exponential Moving Average              |exponentialMovingAverage           |EMA                
Linearly Weighted Moving Average        |linearlyWeightedMovingAverage      |LWMA               
Moving Average Convergence Divergence   |movingAverageConvergenceDivergence |MACD               
On Balance Volume                       |onBalanceVolume                    |OBV                
Relative Strength Index                 |relativeStrengthIndex              |RSI                
Simple Moving Average                   |simpleMovingAverage                |SMA                
Stochastic Oscillator                   |stochasticOscillator               |SO                 


### Collection item

Each item in the result collection contains several object properties. 
See the list which properties belongs to the particular indicator.


Indicator								|Collection Item properties
----------------------------------------|--------------------------------------------------
Average True Range                      |{tr, atr}                              
Bollinger Bands                         |{upper:Array, middle:Array, lower:Array, price:Array}  
Exponential Moving Average              |{price, ema}                           
Linearly Weighted Moving Average        |{price, lmwa}	                       
Moving Average Convergence Divergence   |{slow_ema, fast_ema, signal_ema, macd} 
On Balance Volume                       |{price, obv}                           
Relative Strength Index                 |{price, gain, loss, avg_gain, avg_loss, rs, rsi}   
Simple Moving Average                   |{price, sma}                           
Stochastic Oscillator                   |{k,v, price}                           

### Indicator options

To configure the indicator with different settings, you can pass an optional configuration object into the indicator constructor. 

Indicator								|Options									
----------------------------------------|-------------------------------------------
Average True Range                      |periods, startIndex, endIndex				
Bollinger Bands                         |periods, startIndex, endIndex				
Exponential Moving Average              |range, emaResultsOnly, startWithFirst		
Linearly Weighted Moving Average        |periods, startIndex, endIndex				
Moving Average Convergence Divergence   |fastPeriods, slowPeriods, signalPeriods	
On Balance Volume                       |startIndex, endIndex						
Relative Strength Index                 |periods, startIndex, endIndex					
Simple Moving Average                   |periods, startIndex, endIndex				
Stochastic Oscillator                   |periods, startIndex, endIndex, smaPeriods 	


## Run Tests
---
    $ npm test
	
## License
	
This project is under the MIT License. See the LICENSE file for the full license text.
