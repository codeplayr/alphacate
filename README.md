# Alphacate

---

A node.js toolkit with various indicators and oscillators for the technical stock analysis.


## Example

---

```js
//retrieve indicator module via accessor
const LWMA = require('alphacate').lwma;       

//or retrieve via full name
//const LWMA = require('alphacate').linearlyWeightedMovingAverage;

//pass optional configuration object into constructor
let lwma = new LWMA( {periods: 4} );

//insert data series
lwma.setValues( [10, 15, 16, 18, 20, 18, 17] );

try{
    //invoke calculate function to compute and retrieve result collection
    //an error will be throw if passed data serie or options are invalid
    let resultColection = lwma.calculate();
    console.log(resultColection[0].lwma);
}
catch( err ){
    console.log(err.message);
}
```



### List of indicators

---

See the list below for all available indicators in the package. Retrieve the indicator module via the accessor property or with the alias.


Indicator                               |Module accessor               		|Alias              
----------------------------------------|-----------------------------------|-----------	
Average True Range                      |averageTrueRange                   |atr                
Bollinger Bands                         |bollingerBands                     |bb                 
Exponential Moving Average              |exponentialMovingAverage           |ema                
Linearly Weighted Moving Average        |linearlyWeightedMovingAverage      |lwma               
Moving Average Convergence Divergence   |movingAverageConvergenceDivergence |macd               
On Balance Volume                       |onBalanceVolume                    |obv                
Relative Strength Index                 |relativeStrengthIndex              |rsi                
Simple Moving Average                   |simpleMovingAverage                |sma                
Stochastic Oscillator                   |stochasticOscillator               |so                 


### Collection item

Each item in the result collection contains several object properties. See the list below which properties belongs to the particular indicator. All values are numbers except where noted.


Indicator								|Collection Item properties
----------------------------------------|--------------------------------------------------
Average True Range                      |{tr, atr}                              
Bollinger Bands                         |{upper:Array, middle:Array, lower:Array, price:Array}  
Exponential Moving Average              |{price, ema}                           
Linearly Weighted Moving Average        |{price, lmwa}	                       
Moving Average Convergence Divergence   |{slow_ema:Array, fast_ema:Array, signal_ema:Array, macd, prices:Array} 
On Balance Volume                       |{price, obv}                           
Relative Strength Index                 |{price, gain, loss, avg_gain, avg_loss, rs, rsi}   
Simple Moving Average                   |{price, sma}                           
Stochastic Oscillator                   |{k,v, price}                           

### Indicator options

To configure the indicator with different settings, you can pass an optional configuration object into the indicator constructor. 

Indicator								|Options									
----------------------------------------|-------------------------------------------
Average True Range                      |periods, startIndex, endIndex				
Bollinger Bands                         |periods, startIndex, endIndex, sliceOffset				
Exponential Moving Average              |periods, startIndex, endIndex, sliceOffset	, emaResultsOnly, startWithFirst		
Linearly Weighted Moving Average        |periods, startIndex, endIndex, sliceOffset				
Moving Average Convergence Divergence   |fastPeriods, slowPeriods, signalPeriods, sliceOffset	
On Balance Volume                       |startIndex, endIndex						
Relative Strength Index                 |periods, startIndex, endIndex, sliceOffset					
Simple Moving Average                   |periods, startIndex, endIndex, sliceOffset				
Stochastic Oscillator                   |periods, startIndex, endIndex, smaPeriods, sliceOffset 	


## Run Tests

---
All tests are inside `test` folder

Run tests:

    $ npm test
	
## License
	
This project is under the MIT License. See the LICENSE file for the full license text.
