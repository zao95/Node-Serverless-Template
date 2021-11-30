const setting = {
    testDB: {
        port: 3306,
        host: '',
        user: '',
        password: '',
        database: '',
    },
    devDB: {
        port: 3306,
        host: '',
        user: '',
        password: '',
        database: '',
    },
    prodDB: {
        port: 3306,
        host: '',
        user: '',
        password: '',
        database: '',
    },
    bcrypt: {
        saltRounds: 10,
    },
    jwt: {
        secret: 'test',
    },
    errorTable: {
        /* -- E00X 미정의 -- */
        // E000 미정의
        E00000: {
            errorString: '정의되지 않은 오류',
            statusCode: 400,
        },
        E00001: {
            errorString: '정의되지 않은 오류(명시적)',
            statusCode: 400,
        },
        // E001 원인을 못찾은 오류
        E00010: {
            errorString: '(원인 불명) 그룹 아이디값이 존재하지 않습니다.',
            statusCode: 404,
        },
        /* -- E01X common -- */
        // E010 common 공용
        E01001: {
            errorString: '필수 인자값이 모두 입력되지 않았습니다.',
            statusCode: 400,
        },
        E01002: {
            errorString: '권한이 올바르지 않습니다.',
            statusCode: 401,
        },
        E01003: {
            errorString: '인자의 최대길이를 초과하였습니다.',
            statusCode: 400,
        },
        E01004: {
            errorString: '권한이 없습니다.',
            statusCode: 401,
        },
        E01005: {
            errorString: '권한이 없습니다.',
            statusCode: 401,
        },
        E01006: {
            errorString: '열거형 타입의 인자값이 올바르지 않습니다.',
            statusCode: 400,
        },
        E01007: {
            errorString: '세부 옵션 인자값이 부족합니다.',
            statusCode: 400,
        },
        E01008: {
            errorString: '지정된 요청횟수를 초과하였습니다.',
            statusCode: 400,
        },
        // E011 이메일
        E01101: {
            errorString: '이메일 주소 형식이 맞지 않습니다.',
            statusCode: 400,
        },
        E01102: {
            errorString: '이메일 전송이 되지 않았습니다.',
            statusCode: 400,
        },
        E01103: {
            errorString:
                '가입자 이메일 또는 이메일 인증코드가 일치하지 않습니다.',
            statusCode: 400,
        },
        E01104: {
            errorString: '가입된 사용자의 이메일이 아닙니다.',
            statusCode: 400,
        },
        // E012 패스워드
        E01201: {
            errorString: '유효하지 않는 비밀번호 변경 URL입니다.',
            statusCode: 400,
        },
        /* -- E02X user -- */
        // E020 user 공용
        // E021 user
        E02101: {
            errorString: '이미 가입된 이메일 주소입니다.',
            statusCode: 400,
        },
        E02102: {
            errorString: '수정할 정보가 없습니다.',
            statusCode: 400,
        },
        E02103: {
            errorString: '존재하지 않는 이메일 주소입니다',
            statusCode: 400,
        },
        // E022 user/check_email
        /* -- E03X auth -- */
        // E030 auth 공용
        // E031 auth
        // E032 auth/login
        E03201: {
            errorString: '이메일 또는 비밀번호가 일치하지 않습니다.',
            statusCode: 401,
        },
        E03202: {
            errorString: '비밀번호가 일치하지 않습니다..',
            statusCode: 403,
        },
        /* -- E04X group -- */
        // E040 group 공용
        E04000: {
            errorString: '기존 항목과 중복됩니다.',
            statusCode: 401,
        },
        E04001: {
            errorString: '대상 항목이 존재하지 않습니다.',
            statusCode: 401,
        },
        // E041 group
        E04101: {
            errorString: '등록된 계정 정보를 찾을 수 없습니다.',
            statusCode: 401,
        },
        E04102: {
            errorString: '존재하지 않는 단체입니다.',
            statusCode: 401,
        },
        // E042 group/information
        E04201: {
            errorString: '해당 단체의 정보를 찾을 수 없습니다.',
            statusCode: 404,
        },
        // E043 group/auth
        E04301: {
            errorString: '해당 단체의 정보에 접근할 수 없습니다.',
            statusCode: 403,
        },
        E04302: {
            errorString: '해당 단체의 정보를 수정할 권리가 없습니다.',
            statusCode: 403,
        },
        E04303: {
            errorString: '올바르지 않은 권한 레벨입니다.',
            statusCode: 403,
        },
        E04304: {
            errorString: '비회원은 사용할 수 없는 기능입니다.',
            statusCode: 403,
        },
        // E044 group/contents
        E04400: {
            errorString:
                '요청한 데이터의 수와 장부의 열의 길이가 일치하지 않습니다.',
            statusCode: 400,
        },
    },
}

export default setting
