import setting from "./setting"
import mysqlLib from 'mysql2/promise'

const mysql = async () => {
    console.log('DB 커넥션 생성')
    const connection = await mysqlLib.createConnection(setting.prodDB)

    return connection
}

export default mysql


// datasource:
// url: jdbc:mysql://dev-howser-db.cengmnm7gcf1.ap-northeast-2.rds.amazonaws.com:3306/howser_delivery?useUnicode=true&characterEncoding=utf-8
// username: admin
// password: gkstoadev
// driver-class-name: com.mysql.jdbc.Driver
// test-while-idle: true
// validation-query: SELECT 1