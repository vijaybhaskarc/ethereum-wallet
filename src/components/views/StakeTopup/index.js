import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { colors, measures } from '@common/styles';
import { General as GeneralActions, Wallets as WalletsActions } from '@common/actions';
import Balance from '../WalletExtract/Balance';
import { Button, Calculator } from '@components/widgets';
import { Wallets as WalletActions } from '@common/actions';

@inject('wallet')
@observer
export class StakeTopup extends React.Component {

    topupReserve() {
        const { amount } = this.refs.calc;
        console.log("topupReserve called, amount =" + amount + ", wallet=" + JSON.stringify(this.props.wallet));
        WalletActions.setReserve(this.props.wallet, amount);
        this.props.navigation.navigate('WalletDetails', this.props.wallet);
    }

    onPressConfirmTopupReserve() {
        Alert.alert(
            'Top Up Reserve',
            'This action cannot be undone. Are you sure to continue?',
            [
                { text: 'No', onPress: () => {}, style: 'cancel' },
                { text: 'Yes', onPress: () => this.topupReserve() }
            ],
            { cancelable: false }
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Balance title="Wallet Balance"/>
                <Calculator ref="calc" />
                <Button children="Confirm" onPress={() => this.onPressConfirmTopupReserve()} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.defaultBackground,
        flex: 1
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    icon: {
        width: 24,
        height: 24,
        margin: measures.defaultMargin
    },
    itemTitle: {
        fontSize: measures.fontSizeMedium
    }
});