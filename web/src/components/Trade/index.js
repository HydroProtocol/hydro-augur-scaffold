import React from 'react';
import { connect } from 'react-redux';
import { change, formValueSelector, Field } from 'redux-form';
import { TRADE_FORM_ID } from '../../actions/trade';
import { reduxForm } from 'redux-form';
import { trade } from '../../actions/trade';
import BigNumber from 'bignumber.js';
import { loadHotDiscountRules, getHotTokenAmount } from '../../actions/fee';
import { calculateTrade } from '../../lib/tradeCalculator';
import { loginRequest } from '../../actions/account';
import PerfectScrollbar from 'perfect-scrollbar';
import './styles.scss';
import { sleep, getMarketName } from '../../lib/utils';

const mapStateToProps = state => {
  const selector = formValueSelector(TRADE_FORM_ID);
  const bids = state.market.getIn(['orderbook', 'bids']);
  const asks = state.market.getIn(['orderbook', 'asks']);

  return {
    initialValues: {
      side: 'buy',
      orderType: 'limit',
      amount: new BigNumber(0),
      price: new BigNumber(0),
      subtotal: new BigNumber(0),
      total: new BigNumber(0),
      totalBase: new BigNumber(0),
      feeRate: new BigNumber(0),
      gasFee: new BigNumber(0),
      hotDiscount: new BigNumber(1),
      tradeFee: new BigNumber(0),
      estimatedPrice: new BigNumber(0),
      marketOrderWorstPrice: new BigNumber(0),
      marketOrderWorstTotalQuote: new BigNumber(0),
      marketOrderWorstTotalBase: new BigNumber(0)
    },
    currentAugur: state.market.getIn(['augurs', 'currentAugur']),
    currentMarket: state.market.getIn(['markets', 'currentMarket']),
    markets: state.market.getIn(['markets', 'data']),
    hotTokenAmount: state.config.get('hotTokenAmount'),
    address: state.account.get('address'),
    isLoggedIn: state.account.get('isLoggedIn'),
    price: new BigNumber(selector(state, 'price') || 0),
    amount: new BigNumber(selector(state, 'amount') || 0),
    total: new BigNumber(selector(state, 'total') || 0),
    totalBase: new BigNumber(selector(state, 'totalBase') || 0),
    subtotal: new BigNumber(selector(state, 'subtotal') || 0),
    feeRate: new BigNumber(selector(state, 'feeRate') || 0),
    gasFee: new BigNumber(selector(state, 'gasFee') || 0),
    estimatedPrice: new BigNumber(selector(state, 'estimatedPrice') || 0),
    marketOrderWorstPrice: new BigNumber(selector(state, 'marketOrderWorstPrice') || 0),
    marketOrderWorstTotalQuote: new BigNumber(selector(state, 'marketOrderWorstTotalQuote') || 0),
    marketOrderWorstTotalBase: new BigNumber(selector(state, 'marketOrderWorstTotalBase') || 0),
    hotDiscount: new BigNumber(selector(state, 'hotDiscount') || 1),
    tradeFee: new BigNumber(selector(state, 'tradeFee') || 0),
    side: selector(state, 'side'),
    orderType: selector(state, 'orderType'),
    bestBidPrice: bids.size > 0 ? bids.get(0)[0].toString() : null,
    bestAskPrice: asks.size > 0 ? asks.get(asks.size - 1)[0].toString() : null
  };
};

class Trade extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    loadHotDiscountRules();
    this.interval = window.setInterval(() => {
      dispatch(getHotTokenAmount());
    }, 30 * 1000);
  }

  componentDidUpdate(prevProps) {
    const { currentMarket, reset } = this.props;
    if (currentMarket.id === prevProps.currentMarket.id) {
      this.updateFees(prevProps);
    } else {
      reset();
    }
  }

  render() {
    const { dispatch, side, handleSubmit, currentMarket, total, gasFee, tradeFee, subtotal, currentAugur } = this.props;
    if (!currentMarket) {
      return null;
    }

    return (
      <>
        <div className="title">
          <div>{currentMarket.baseTokenName}</div>
          <div className="text-secondary">Make a Limit Order</div>
        </div>
        <div className="trade flex-1 flex-column">
          <ul className="nav nav-tabs">
            <li className="nav-item flex-1 flex">
              <div
                className={`flex-1 trade-tab text-secondary text-center${side === 'buy' ? ' active' : ''}`}
                onClick={() => dispatch(change(TRADE_FORM_ID, 'side', 'buy'))}>
                Buy
              </div>
            </li>
            <li className="nav-item flex-1 flex">
              <div
                className={`flex-1 trade-tab text-secondary text-center${side === 'sell' ? ' active' : ''}`}
                onClick={() => dispatch(change(TRADE_FORM_ID, 'side', 'sell'))}>
                Sell
              </div>
            </li>
          </ul>
          <div className="flex flex-1 position-relative overflow-hidden" ref={ref => this.setRef(ref)}>
            <form
              className="flex-column text-secondary flex-1 justify-content-between"
              onSubmit={handleSubmit(() => this.submit())}>
              <div>
                <div>
                  <div className="form-group">
                    <label>Price</label>
                    <div className="input-group">
                      <Field
                        name="price"
                        className="form-control"
                        autoComplete="off"
                        min="0"
                        type="number"
                        max="1"
                        step="0.001"
                        component={'input'}
                      />
                      <span className="text-secondary unit">{currentMarket.quoteToken}</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Amount</label>
                    <div className="input-group">
                      <Field name="amount" className="form-control" autoComplete="off" component={'input'} />
                      <span className="text-secondary unit">{currentMarket.baseTokenName}</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-title">Order Summary</div>
                    <div className="list">
                      <div className="item flex justify-content-between">
                        <div className="name">Order</div>
                        <div className="name">{subtotal.toFixed(currentMarket.priceDecimals)}</div>
                      </div>
                      <div className="item flex justify-content-between">
                        <div className="name">Fees</div>
                        <div className="name">{gasFee.plus(tradeFee).toFixed(currentMarket.priceDecimals)}</div>
                      </div>
                      <div className="item flex justify-content-between">
                        <div className="name">Total</div>
                        <div className="name">{total.toFixed(currentMarket.priceDecimals)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-title">
                    Diagrams <small>(fake data for now)</small>
                  </div>
                  {this.renderDiagrams()}
                </div>
                <div className="form-group">
                  <div className="form-title">Description</div>
                  <div dangerouslySetInnerHTML={{ __html: currentAugur.description }} />
                </div>
                {currentAugur.category === 'scalar' ? (
                  <div className="form-group">
                    <div className="form-title">Range</div>
                    <div className="list">
                      <div className="item flex justify-content-between">
                        <span>Mininum:</span>
                        <span>{currentAugur.minimum}</span>
                      </div>
                      <div className="item flex justify-content-between">
                        <span>Maxinum:</span>
                        <span>{currentAugur.maximum}</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <button type="submit" className={`form-control btn ${side === 'buy' ? 'btn-success' : 'btn-danger'}`}>
                {side} {currentMarket.baseTokenName}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  randomFakePercentage = num => {
    let res = [];
    for (let i = 0; i < num; i++) {
      res.push(Math.random());
    }
    const sum = res.reduce((acc, c) => acc + c, 0);
    res = res.map(x => Math.floor((x / sum) * 100));

    for (let i = 0, s = 0; i < num; i++) {
      if (i === num - 1) {
        res[num - 1] = 100 - s;
      } else {
        s += res[i];
      }
    }
    return res;
  };

  renderDiagrams() {
    const { markets } = this.props;
    const ms = markets.toJS();
    const percenntages = this.randomFakePercentage(ms.length);
    return (
      <table className="list marketDiagrams">
        {ms.map((market, index) => {
          return (
            <tr key={market.id} className="item marketDiagram">
              <td>{market.baseTokenName}</td>
              <td>
                <div className={`option-color-${index}`} style={{ width: `${percenntages[index]}%` }} />
              </td>
              <td>{percenntages[index]}%</td>
            </tr>
          );
        })}
      </table>
    );
  }

  async submit() {
    const { amount, price, side, orderType, dispatch, isLoggedIn, address } = this.props;
    if (!isLoggedIn) {
      await dispatch(loginRequest(address));
      // Metamask's window will be hidden when continuous call Metamask sign method
      await sleep(500);
    }
    try {
      await dispatch(trade(side, price, amount, orderType));
    } catch (e) {
      alert(e);
    }
  }

  updateFees(prevProps) {
    const { currentMarket, orderType, side, price, amount, hotTokenAmount, change } = this.props;

    if (
      orderType === prevProps.orderType &&
      side === prevProps.side &&
      price.eq(prevProps.price) &&
      amount.eq(prevProps.amount) &&
      hotTokenAmount.eq(prevProps.hotTokenAmount)
    ) {
      return;
    }
    const { asMakerFeeRate, asTakerFeeRate, gasFeeAmount, priceDecimals, amountDecimals } = currentMarket;

    const calculateParam = {
      orderType,
      side,
      price: new BigNumber(price),
      amount: new BigNumber(amount),
      hotTokenAmount,
      gasFeeAmount,
      asMakerFeeRate,
      asTakerFeeRate,
      amountDecimals,
      priceDecimals
    };

    const calculateResult = calculateTrade(calculateParam);

    change('subtotal', calculateResult.subtotal);
    change('estimatedPrice', calculateResult.estimatedPrice);
    change('totalBase', calculateResult.totalBaseTokens);
    change('total', calculateResult.totalQuoteTokens);
    change('feeRate', calculateResult.feeRateAfterDiscount);
    change('gasFee', calculateResult.gasFeeAmount);
    change('hotDiscount', calculateResult.hotDiscount);
    change('tradeFee', calculateResult.tradeFeeAfterDiscount);
  }

  setRef(ref) {
    if (ref) {
      this.ps = new PerfectScrollbar(ref, {
        suppressScrollX: true,
        maxScrollbarLength: 20
      });
    }
  }
}

export default connect(mapStateToProps)(
  reduxForm({
    form: TRADE_FORM_ID,
    destroyOnUnmount: false
  })(Trade)
);
