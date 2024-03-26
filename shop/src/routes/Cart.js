import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { changeName } from '../store';


function Cart() {

    let state = useSelector((state) => state)
    let dispatch = useDispatch();
    return (
        <div>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>변경하기</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>{state.cart[0].name}</td>
                        <td>안녕</td>
                        <td><button 
                            onClick={
                                () => {
                                dispatch(changeName(0))
                                }
                            }
                        >+</button></td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default Cart;