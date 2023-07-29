from AlgorithmImports import *

class PriceActionAlpha(AlphaModel):
    def __init__(self, algorithm, symbol):
        self.algorithm = algorithm
        self.btc = symbol

        self.hour = -1
        self.selltrig = None
        self.buytrig = None
        self.currentopen = None

        self.consolidator = TradeBarConsolidator(timedelta(1))
        self.consolidator.DataConsolidated += self.OnConsolidated
        self.window = RollingWindow[TradeBar](4)

        history = algorithm.History[TradeBar](self.btc, 4*24*60, Resolution.Minute)
        for bar in history:
            self.consolidator.Update(bar)

        algorithm.SubscriptionManager.AddConsolidator(self.btc, self.consolidator)

    def OnConsolidated(self, sender, bar):
        self.window.Add(bar)
        self.currentopen = bar.Open

        if not self.window.IsReady: return

        df = self.algorithm.PandasConverter.GetDataFrame[TradeBar](self.window)    
        k1 = 0.5
        k2 = 0.5
        
        HH, HC, LC, LL = max(df['high']), max(df['close']), min(df['close']), min(df['low'])
        if (HH - LC) >= (HC - LL):
            signalrange = HH - LC
        else:
            signalrange = HC - LL
        
        self.selltrig = self.currentopen - k2 * signalrange
        self.buytrig = self.currentopen + k1 * signalrange    
    
    def Update(self, algorithm, data):        
        # We only use hourly signals
        if not data.ContainsKey(self.btc) or not self.window.IsReady:
            return []

        if self.hour == algorithm.Time.hour:
            return []
        self.hour = algorithm.Time.hour
        
        price = data[self.btc].Price
        
        if algorithm.LiveMode:
            algorithm.Log(f'Buy Trigger {self.buytrig} > Price {price} > {self.selltrig}')
        
        if price >= self.buytrig:
            return [Insight(self.btc, timedelta(days=365), InsightType.Price, InsightDirection.Up)]
        elif price < self.selltrig:
            algorithm.Insights.Cancel([self.btc])
        
        return []