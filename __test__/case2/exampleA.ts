const case2A = location.host == 'test' ? null : require("case2");

if(location.host == 'test1' ){
    case2A.start();
}

case2A.stop();