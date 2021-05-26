import ApolloClient from 'apollo-boost';

const apolloClient = new ApolloClient({
    // @ts-ignore
    // 你需要在这里使用绝对路径
    uri: 'ws://192.168.1.164:8081/subscriptions'
})
export default apolloClient;

