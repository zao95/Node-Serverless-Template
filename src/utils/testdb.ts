import setting from "./setting"
import mysqlLib from 'mysql2/promise'


const mysql = async () => {
    console.log('DB 커넥션 생성')
    const connection = await mysqlLib.createConnection(setting.testDB)

    return connection
}

export default mysql