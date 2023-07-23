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
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
import numpy as np
from sklearn.preprocessing import MinMaxScaler

class AdvancedCryptoAlgorithm(QCAlgorithm):

    def Initialize(self):
        self.SetStartDate(2023, 1, 1)  
        self.SetCash(100000)  
        self.AddCrypto("BTCUSD", Resolution.Hour)

        self.sma = self.SMA("BTCUSD", 14, Resolution.Hour)
        self.is_up_trend = False
        self.lookback = 30  

        self.model = Sequential()
        self.model.add(LSTM(50, return_sequences=True, input_shape=(self.lookback, 1)))
        self.model.add(LSTM(50, return_sequences=False))
        self.model.add(Dense(25))
        self.model.add(Dense(1))

        self.model.compile(optimizer='adam', loss='mean_squared_error')

        self.scale = MinMaxScaler(feature_range=(0,1))  
        self.price_list = []

    def OnData(self, data):
        price = data["BTCUSD"].Close
        self.price_list.append(price)
        if len(self.price_list) > self.lookback:
            self.price_list.pop(0)

        if len(self.price_list) < self.lookback:
            return

        data_scaled = self.scale.fit_transform(np.array(self.price_list).reshape(-1,1))
        x_test = np.array(data_scaled[len(data_scaled) - self.lookback:]).reshape(1, self.lookback, 1)
        
        predicted_price = self.model.predict(x_test)
        predicted_price = self.scale.inverse_transform(predicted_price)

        if self.sma.IsReady:
            if self.sma.Current.Value > price and not self.is_up_trend:
                self.SetHoldings("BTCUSD", 1.0)
                self.is_up_trend = True
            elif self.sma.Current.Value < price and self.is_up_trend:
                self.SetHoldings("BTCUSD", 0)
                self.is_up_trend = False
