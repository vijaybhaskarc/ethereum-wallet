import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { colors, measures } from '@common/styles';
import { Wallet as WalletUtils } from '@common/utils';
import { Wallets as WalletActions } from '@common/actions';


@inject('prices', 'wallet')
@observer
export default class StakeBalance extends React.Component {

    get reserve() {
        console.log("StakeBalance.reserve(): this.props.wallet=" + JSON.stringify(this.props.wallet));
        let result= Number(WalletActions.getReserve(this.props.wallet.item));
        if (isNaN(result)) {
            result = 0.0;
        }
        return result;
    }
    
    get fiatReserve() {
        return Number(this.props.prices.usd * this.reserve);
    }

    componentDidMount() {
        WalletActions.updateReserve(this.props.wallet);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.leftColumn}>
                    <Text style={styles.title}>Reserve Balance:</Text>
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.balance}>ICASH {this.reserve.toFixed(3)}</Text>
                    <Text style={styles.fiatBalance}>US$ {this.fiatReserve.toFixed(2)}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 60,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray
    },
    leftColumn: {
        flex: 4
    },
    title: {
        fontSize: measures.fontSizeLarge,
        color: colors.gray
    },
    balance: {
        fontSize: measures.fontSizeMedium,
        fontWeight: 'bold',
        color: colors.gray
    },
    fiatBalance: {
        fontSize: measures.fontSizeMedium - 3,
        color: colors.gray
    },
    rightColumn: {
        flex: 3,
        alignItems: 'flex-end',
        justifyContent: 'center'
    }
});