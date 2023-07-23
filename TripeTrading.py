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
from QuantConnect.Data.Market import TradeBar, QuoteBar

from sklearn.linear_model import Ridge
import numpy as np
import pandas as pd

class RidgePairsTradingAlgorithm(QCAlgorithm):

    def Initialize(self):
        self.SetStartDate(2023, 1, 1)  
        self.SetCash(10000)  

        self.AddCrypto("BTCUSD", Resolution.Hour)
        self.AddCrypto("ETHUSD", Resolution.Hour)
        self.AddCrypto("LTCUSD", Resolution.Hour)

        self.lookback = 30
        self.threshold = 1
        self.stopLossPercent = 0.05
        self.positionSize = 0.1

        self.model = Ridge(alpha=0.5)
        self.data = pd.DataFrame()

    def OnData(self, data):
        if not data.ContainsKey("BTCUSD") or not data.ContainsKey("ETHUSD") or not data.ContainsKey("LTCUSD"):
            return

        btc = data["BTCUSD"]
        eth = data["ETHUSD"]
        ltc = data["LTCUSD"]

        self.data = self.data.append({"BTC": btc.Close, "ETH": eth.Close, "LTC": ltc.Close}, ignore_index=True)
        if len(self.data) > self.lookback:
            self.data = self.data.iloc[1:]

        if len(self.data) < self.lookback:
            return

        df = self.data.copy()
        df["BTC_Return"] = df["BTC"].pct_change()
        df["ETH_Return"] = df["ETH"].pct_change()
        df["LTC_Return"] = df["LTC"].pct_change()
        df["BTC_Volatility"] = df["BTC_Return"].rolling(5).std()
        df["ETH_Volatility"] = df["ETH_Return"].rolling(5).std()
        df["LTC_Volatility"] = df["LTC_Return"].rolling(5).std()
        df = df.dropna()

        y_train = df["ETH"].values.reshape(-1, 1)
        x_train = df[["BTC", "LTC", "BTC_Return", "ETH_Return", "LTC_Return", "BTC_Volatility", "ETH_Volatility", "LTC_Volatility"]].values

        self.model.fit(x_train, y_train)

        x_test = np.array([btc.Close, ltc.Close, df["BTC_Return"].iloc[-1], df["ETH_Return"].iloc[-1], df["LTC_Return"].iloc[-1], df["BTC_Volatility"].iloc[-1], df["ETH_Volatility"].iloc[-1], df["LTC_Volatility"].iloc[-1]]).reshape(1, -1)
        predicted_price = self.model.predict(x_test)

        if predicted_price > eth.Close:
            self.SetHoldings("ETHUSD", self.positionSize)
            self.SetHoldings("BTCUSD", -self.positionSize)
            self.SetHoldings("LTCUSD", -self.positionSize)
            self.StopMarketOrder("ETHUSD", -self.Portfolio["ETHUSD"].Quantity, eth.Close * (1 - self.stopLossPercent))
        else:
            self.SetHoldings("ETHUSD", -self.positionSize)
            self.SetHoldings("BTCUSD", self.positionSize)
            self.SetHoldings("LTCUSD", self.positionSize)
            self.StopMarketOrder("BTCUSD", -self.Portfolio["BTCUSD"].Quantity, btc.Close * (1 - self.stopLossPercent))
            self.StopMarketOrder("LTCUSD", -self.Portfolio["LTCUSD"].Quantity, ltc.Close * (1 - self.stopLossPercent))
