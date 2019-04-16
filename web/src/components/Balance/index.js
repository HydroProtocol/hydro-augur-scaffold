import React from 'react';
import { connect } from 'react-redux';
import { WRAP_TYPE, setWrapType, loadTokens } from '../../actions/account';
import { toUnitAmount, isTokenApproved } from '../../lib/utils';
import BigNumber from 'bignumber.js';
import { enable, disable } from '../../lib/web3';
import Wrap from '../Wrap';
import PerfectScrollbar from 'perfect-scrollbar';

const mapStateToProps = state => {
  return {
    tokensInfo: state.account.get('tokensInfo'),
    address: state.account.get('address'),
    isLoggedIn: state.account.get('isLoggedIn'),
    lockedBalances: state.account.get('lockedBalances'),
    ethBalance: toUnitAmount(state.account.get('ethBalance'), 18)
  };
};

class Balance extends React.PureComponent {
  componentDidMount() {
    const { address, dispatch, isLoggedIn } = this.props;
    if (address && isLoggedIn) {
      dispatch(loadTokens());
    }
  }

  componentDidUpdate(prevProps) {
    const { address, dispatch, isLoggedIn } = this.props;
    const loggedInChange = isLoggedIn !== prevProps.isLoggedIn;
    const accountChange = address !== prevProps.address;
    if (isLoggedIn && address && (loggedInChange || accountChange)) {
      dispatch(loadTokens());
    }
  }

  render() {
    const { dispatch, tokensInfo, lockedBalances, ethBalance } = this.props;
    return (
      <div
        className="balance flex-1 column-center text-secondary position-relative overflow-hidden"
        style={{ padding: 24 }}
        ref={ref => this.setRef(ref)}>
        <table className="table table-light">
          <thead>
            <tr className="text-secondary">
              <td>Token</td>
              <td>Available</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ETH</td>
              <td>{ethBalance.toFixed(5)}</td>
              <td>
                <button
                  className="btn btn-outline-success"
                  data-toggle="modal"
                  data-target="#wrap"
                  onClick={() => dispatch(setWrapType(WRAP_TYPE.WRAP))}>
                  WRAP
                </button>
              </td>
            </tr>
            {tokensInfo.toArray().map(([token, info]) => {
              const { address, balance, allowance, decimals } = info.toJS();
              const lockedBalance = lockedBalances.get(token, new BigNumber('0'));
              const isApproved = isTokenApproved(allowance || new BigNumber('0'));
              const availableBalance = toUnitAmount(
                balance.minus(lockedBalance) || new BigNumber('0'),
                decimals
              ).toFixed(5);
              const toolTipTitle = `<div>In-Order: ${toUnitAmount(lockedBalance, decimals).toFixed(
                5
              )}</div><div>Total: ${toUnitAmount(balance, decimals).toFixed(5)}</div>`;
              return (
                <tr key={token}>
                  <td>{token}</td>
                  <td
                    key={toolTipTitle}
                    data-html="true"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={toolTipTitle}
                    ref={ref => window.$(ref).tooltip()}>
                    {availableBalance}
                  </td>
                  <td>
                    {isApproved ? (
                      <button className="btn btn-outline-danger" onClick={() => dispatch(disable(address, token))}>
                        Disable
                      </button>
                    ) : (
                      <button className="btn btn-outline-success" onClick={() => dispatch(enable(address, token))}>
                        Enable
                      </button>
                    )}
                    {token === 'WETH' && (
                      <button
                        className="btn btn-outline-danger"
                        data-toggle="modal"
                        data-target="#wrap"
                        style={{ marginLeft: 12 }}
                        onClick={() => dispatch(setWrapType(WRAP_TYPE.UNWRAP))}>
                        UNWRAP
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Wrap />
      </div>
    );
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

export default connect(mapStateToProps)(Balance);
