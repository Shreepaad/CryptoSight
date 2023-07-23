#region imports
from AlgorithmImports import *
#endregion
from clr import AddReference
AddReference("System")
AddReference("QuantConnect.Algorithm")
AddReference("QuantConnect.Common")

from System import *
from QuantConnect import *
from QuantConnect.Algorithm import *

class ReverseTradingAlgorithm(QCAlgorithm):

    def Initialize(self):
        self.SetStartDate(2023, 1, 1)  
        self.SetCash(100000)  
        self.symbol = self.AddCrypto("BTCUSD", Resolution.Hour).Symbol
        self.previous = None

    def OnData(self, data):
        if not data.ContainsKey(self.symbol):
            return

        close = data[self.symbol].Close

        if self.previous is not None:
            if close < self.previous and not self.Portfolio.Invested:
                self.SetHoldings(self.symbol, 1)
            elif close > self.previous and self.Portfolio.Invested:
                self.Liquidate(self.symbol)

        self.previous = close
