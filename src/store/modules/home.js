const LOAD = 'home/LOAD'
const LOAD_SUCCESS = 'home/LOAD_SUCCESS'
const LOAD_FAILURE = 'home/LOAD_FAILURE'

const initialState = {
    loading: false, //正在加载中
    loaded: false,  //是否已加载
    data: null      //加载的数据
}


export default function home(state=initialState, action){
    switch(action.type){
        case LOAD_SUCCESS:
            return {...state,data:action.payload};
        default:
            return state
    }
}


/* actions */
export const load = () =>{
    return (dispatch,getState, request) =>{
        const {home} = getState()
        //judge if need to load
        if(home.data){
            return Promise.resolve(home.data)
        }

        //start load
        dispatch({type:LOAD})
        const p = request('getArticleList')
        p.then(data=>{
            dispatch({type:LOAD_SUCCESS, payload:data})
        }).catch(err=>{
            dispatch({type:LOAD_FAILURE,payload:err})
            console.log(err)
        })
        return p
    }
}
