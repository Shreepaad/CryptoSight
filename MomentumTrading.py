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
from QuantConnect.Indicators import *
import datetime

class BasicMomentumTradingAlgorithm(QCAlgorithm):

    def Initialize(self):
        self.SetStartDate(2023, 1, 1)  
        self.SetCash(100000)  
        self.symbol = self.AddCrypto("BTCUSD", Resolution.Hour).Symbol

        self.lookback = 21
        self.ceiling, self.floor = 60, 40
        self.target_percent = 0.3
        self.initialStopRisk = 0.98
        self.trailingStopRisk = 0.9

        self.rsi = self.RSI(self.symbol, self.lookback,  MovingAverageType.Wilders, Resolution.Daily)
        self.SetWarmUp(self.lookback)

        self.stopMarketTicket = None
        self.stopMarketOrderFillTime = datetime.datetime.min
        self.resetStopMarketOrder = False
        self.stopPrice = 0

    def OnData(self, data):
        if not self.rsi.IsReady:
            return

        self.Debug("RSI Value: " + str(self.rsi.Current.Value))

        if not self.Portfolio.Invested:
            if self.rsi.Current.Value < self.floor:
                self.Debug("RSI below floor, placing order")
                self.MarketOrder(self.symbol, self.CalculateOrderQuantity(self.symbol, self.target_percent))
                self.stopPrice = self.initialStopRisk * self.Securities[self.symbol].Close
                self.stopMarketTicket = self.StopMarketOrder(self.symbol, 
                                                             -self.CalculateOrderQuantity(self.symbol, self.target_percent), 
                                                             self.stopPrice)
        else:
            if self.rsi.Current.Value > self.ceiling:
                self.Debug("RSI above ceiling, liquidating")
                self.Liquidate(self.symbol)
                self.stopMarketTicket = None

            if self.Portfolio[self.symbol].IsLong:
                if self.Securities[self.symbol].Close > self.stopPrice:
                    self.stopPrice = self.Securities[self.symbol].Close * self.trailingStopRisk
                    
                    if self.stopMarketTicket is not None:
                        self.Transactions.CancelOrder(self.stopMarketTicket.OrderId)

                    self.stopMarketTicket = self.StopMarketOrder(self.symbol, 
                                                                 -self.CalculateOrderQuantity(self.symbol, self.target_percent), 
                                                                 self.stopPrice)

                    self.Debug("Update stop price: " + str(self.stopPrice))