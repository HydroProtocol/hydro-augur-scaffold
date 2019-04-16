import BigNumber from 'bignumber.js';
import api from '../lib/api';

export const updateCurrentMarket = currentMarket => {
  return async dispatch => {
    return dispatch({
      type: 'UPDATE_CURRENT_MARKET',
      payload: { currentMarket }
    });
  };
};

export const updateCurrentAugur = currentAugur => {
  return async dispatch => {
    await dispatch({
      type: 'UPDATE_CURRENT_AUGUR',
      payload: { currentAugur }
    });

    await dispatch(loadMarkets(currentAugur.id));

    return;
  };
};

export const loadMarkets = augurID => {
  return async (dispatch, getState) => {
    const res = await api.get(`/markets?augurID=${augurID}`);
    if (res.data.status === 0) {
      const markets = res.data.data.markets;
      markets.forEach(formatMarket);
      await dispatch({
        type: 'LOAD_MARKETS',
        payload: { markets }
      });

      const state = getState();

      if (!state.market.getIn(['markets', 'currentMarket'])) {
        await dispatch(updateCurrentMarket(markets[0]));
      }
    }
  };
};

export const loadAugurs = () => {
  return async (dispatch, getState) => {
    const res = await api.get(`/augurs`);

    if (res.data.status === 0) {
      const augurs = res.data.data.augurs;
      augurs.forEach(formatMarket);
      await dispatch({
        type: 'LOAD_AUGURS',
        payload: { augurs }
      });

      const state = getState();

      if (!state.market.getIn(['augurs', 'currentAugur'])) {
        await dispatch(updateCurrentAugur(augurs[0]));
      }
    }
  };
};

// load current market trade history
export const loadTradeHistory = marketID => {
  return async (dispatch, getState) => {
    const res = await api.get(`/markets/${marketID}/trades`);
    const currentMarket = getState().market.getIn(['markets', 'currentMarket']);
    if (currentMarket.id === marketID) {
      return dispatch({
        type: 'LOAD_TRADE_HISTORY',
        payload: res.data.data.trades
      });
    }
  };
};

const formatMarket = market => {
  market.gasFeeAmount = new BigNumber(market.gasFeeAmount);
  market.asMakerFeeRate = new BigNumber(market.asMakerFeeRate);
  market.asTakerFeeRate = new BigNumber(market.asTakerFeeRate);
  market.marketOrderMaxSlippage = new BigNumber(market.marketOrderMaxSlippage);
};
