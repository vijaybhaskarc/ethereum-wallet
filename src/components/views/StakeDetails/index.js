import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@components/widgets';
import { inject, observer } from 'mobx-react';
import { colors, measures } from '@common/styles';
import StakeBalance from './StakeBalance';
import { GeneralActions } from '@common/actions';
import { Wallets as WalletActions } from '@common/actions';


@inject('wallet')
@observer
export class StakeDetails extends React.Component {

    componentDidMount() {
        this.updateHistory();
    }

    async updateHistory() {
       try
       {
           console.log("wallet.item=" + JSON.stringify(this.props.wallet));
           await WalletActions.updateHistory(this.props.wallet.item);
       } catch (e) {
           console.log("e=" + e);
           GeneralActions.notify(e.message, 'long');
       }
    }

    onPressTopUpReserve() {
        const { walletName, walletDescription } = this.props.navigation.state.params;
        this.props.navigation.navigate('StakeTopup', { walletName, walletDescription });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <StakeBalance />
                    <View style={styles.messages}>
                        <Text>In order for you to be able to start answering questions in the app, we need you to create a reserve.</Text>
                        <Text></Text>
                        <Text>The reserve is the pot of tokens that you hold, to which if you answer a question correctly and subtract if you answer incorrectly.</Text>
                        <Text></Text>
                        <Text>If you are not ready to do this just yet, you can explore the app and top up your reserve later!</Text>
                    </View>
                </View>
                <View style={styles.buttonsContainer}>
                    <Button onPress={() => this.onPressTopUpReserve()}>Top Up Reserve</Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        flex: 1,
        padding: measures.defaultPadding
    },
    content: {
        marginTop: measures.defaultMargin,
        backgroundColor: colors.defaultBackground,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        flex: 1,
        padding: measures.defaultPadding
    },
    messages: {
        backgroundColor: colors.defaultBackground,
        alignItems: 'stretch',
        flex: 1,
        justifyContent: 'center',
        padding: measures.defaultPadding,
    },
    message: {
        color: colors.black,
        fontSize: 16,
        textAlign: 'center',
        marginVertical: measures.defaultMargin,
        marginHorizontal: 32
    },
    buttonsContainer: {
        justifyContent: 'space-between'
    }
});