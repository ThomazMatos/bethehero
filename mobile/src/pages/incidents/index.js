import React, {useEffect, useState} from 'react'
import {View, Image, Text, TouchableOpacity, FlatList} from 'react-native'
import { Feather } from '@expo/vector-icons'
import logoImg from '../../assets/logo.png'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'


import api from '../../services/api'

export default function Incidents (){
    const [incidents, setIncidents] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)



    const navigation = useNavigation()

    function navigateToDetail(incident){
        navigation.navigate('Detail', {incident})
    }

    async function loadIncidents(){

        alert(page)

       
        if(loading){
            return
        }

        if(total > 0 && incidents.length == total){
            return
        }

        setLoading(true)
        try{
            const response = await api.get('incidents', {
                params: {page}
                
            })
            setPage(page+1)
            setLoading(false)
            setIncidents([...incidents, ...response.data.incidents])
            setTotal(response.headers['x-total-count'])
        } catch (err){
            alert('Não foi possivel resgatar os dados')
        }
        

    }

    useEffect(()=>{
        loadIncidents()
    }, [])

    return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Image source={logoImg} ></Image>
            <Text style={styles.headerText}>
                Total de <Text style={styles.headerTextBold}>{total} casos</Text>
            </Text>
        </View>

        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia</Text>

        <FlatList
        data = {incidents}
        keyExtractor={incident => String(incident.id)}
        style={styles.incidentList}
        showsVerticalScrollIndicator={true}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.1}
        renderItem={({item})=>(
                <View style={styles.incident}>
                    <Text style={styles.incidentProperty}>ONG:</Text>
                    <Text style={styles.incidentValue}>{item.name}</Text>
            
                    <Text style={styles.incidentProperty}>CASO:</Text>
                    <Text style={styles.incidentValue}>{item.title}</Text>

                    <Text style={styles.incidentProperty}>VALOR:</Text>
                    <Text style={styles.incidentValue}>{item.value}</Text>
            
                    <TouchableOpacity style={styles.detailsButton} onPress={()=>navigateToDetail(item)}>
                        <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                        <Feather name="arrow-right" size={16} color="#E02041"></Feather>
                    </TouchableOpacity>



                </View>
            
        )}
    ></FlatList>
    </View>
    )
}