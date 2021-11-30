import setting from "./setting"
import mysqlLib from 'mysql2/promise'

const mysql = async () => {
    console.log('devDB 커넥션 생성')
    const connection = await mysqlLib.createConnection(setting.devDB)
    console.log('devDB 커넥션 생성 완료')

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