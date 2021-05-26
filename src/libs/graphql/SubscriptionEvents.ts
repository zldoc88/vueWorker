import gql from 'graphql-tag'
import apolloClient from './Graphql'
 
export const deviceEvents4Floor = ( floorId: string ) => {
    return apolloClient.subscribe({
        query: gql`subscription DeviceEvents4Floor( $floorId: String! ){
            AllDeviceEvents: ibms_onDeviceEventByFloor( floorId: $floorId ){
                deviceId,
                __typename,
            },
        }`,
        variables: floorId
    })
}
