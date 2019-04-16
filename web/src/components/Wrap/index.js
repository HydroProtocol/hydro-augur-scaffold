import React from 'react';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { wrapETH, unwrapWETH } from '../../lib/web3';
import { toUnitAmount } from '../../lib/utils';
import { WRAP_TYPE } from '../../actions/account';

const mapStateToProps = state => {
  const WETH = state.config.get('WETH');
  return {
    ethBalance: toUnitAmount(state.account.get('ethBalance'), 18),
    wethBalance: toUnitAmount(state.account.getIn(['tokenBalances', 'WETH']) || new BigNumber(0), WETH.decimals),
    wrapType: state.account.get('wrapType')
  };
};

class Wrap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      amount: '0'
    };
  }

  render() {
    const { ethBalance, wethBalance, wrapType } = this.props;
    const { amount } = this.state;

    return (
      <div className="modal fade" id="wrap" tabIndex="-1" role="dialog" aria-labelledby="wrapLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="wrapLabel">
                {wrapType}
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>
                  Amount{' '}
                  <font className="text-secondary">
                    (ETH Balance: {ethBalance.toFixed(8)} WETH Balance: {wethBalance.toFixed(8)})
                  </font>
                </label>
                <div className="input-group">
                  <input
                    className="form-control"
                    value={amount}
                    onChange={event => this.setState({ amount: event.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => this.submit()}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  submit() {
    const { dispatch, wrapType } = this.props;
    const { amount } = this.state;
    if (wrapType === WRAP_TYPE.WRAP) {
      dispatch(wrapETH(amount));
    } else {
      dispatch(unwrapWETH(amount));
    }
  }
}

export default connect(mapStateToProps)(Wrap);
