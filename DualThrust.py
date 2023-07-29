from clr import AddReference
AddReference("System")
AddReference("QuantConnect.Algorithm")
AddReference("QuantConnect.Common")

from System import *
from QuantConnect import *
from QuantConnect.Algorithm import *

class DualThrustAlgorithm(QCAlgorithm):
    
    def Initialize(self):
        self.SetStartDate(2023, 1, 1)  
        self.SetCash(100000)  
        self.symbol = self.AddCrypto("BTCUSD", Resolution.Hour).Symbol

        # Initialize parameters
        self.period = 14
        self.k1 = 0.5
        self.k2 = 0.5

        # Initialize the open, high, low, and close prices
        self.open = self.History(self.symbol, self.period, Resolution.Daily)["open"].tolist()
        self.high = self.History(self.symbol, self.period, Resolution.Daily)["high"].tolist()
        self.low = self.History(self.symbol, self.period, Resolution.Daily)["low"].tolist()
        self.close = self.History(self.symbol, self.period, Resolution.Daily)["close"].tolist()

    def OnData(self, data):
        if len(self.open) < self.period:
            return 

        # Calculate the range
        high_minus_low = max(self.high[-self.period:]) - min(self.low[-self.period:])
        close_minus_open = self.close[-1] - self.open[-1]
        range_max = max(high_minus_low, close_minus_open)
    
        # Calculate the buy and sell thresholds
        buy_thresh = self.open[-1] + self.k1 * range_max
        sell_thresh = self.open[-1] - self.k2 * range_max

        if not self.Portfolio.Invested:
            # Enter positions based on the thresholds
            if data[self.symbol].Close > buy_thresh:
                self.SetHoldings(self.symbol, 1.0)
            elif data[self.symbol].Close < sell_thresh:
                elf.Liquidate(self.symbol)
                
        else:
            # Exit positions based on the thresholds
            if data[self.symbol].Close < sell_thresh:
                self.Liquidate(self.symbol)