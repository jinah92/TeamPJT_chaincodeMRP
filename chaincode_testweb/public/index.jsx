var { Component } = React;

const url = '70.12.113.182:9090';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { comments: [], history: [], mediData: [] };
  }

  /* getMedicineInfo = async () => {
    const data = await getMedicineInfo().then((data) => data.data);
    this.setState({ mediData: data.sort((a, b) => a.mediCode - b.mediCode) });
  };

  getMedicineInfo = () => {
    return axios.post(`http://${url}/oversee/mediInfo`, {});
  }; */

  handleChange = (event) => {
    this.setState({ productState: event.target.value });
  };

  // 전문의약품 목록 조회
  showMediData = async () => {
    let data = await axios.post(`http://${url}/oversee/mediInfo`, {});
    data.data.sort((a, b) => a.mediCode - b.mediCode);
    data = data.data;

    let allMediData = data.map((element) => {
      return (
        <tr
          key={element.mediCode}
          onClick={() => {
            this.showDetails(element.mediCode);
          }}
        >
          <td>{element.mediCode}</td>
          <td>{element.mediName}</td>
          <td>{element.mediType}</td>
          <td>{element.count}</td>
          <td>{element.permissionDate}</td>
          <td>{element.cancelDate}</td>
          <td>{element.updatedAt}</td>
        </tr>
      );
    });
    this.setState({ mediData: allMediData });
  };

  // 표준코드에 속하는 모든 바코드 목록 조회
  showDetails = (target) => {
    const mediCode = target;
    alert('표준코드 : '+mediCode);
    const sendParam = {mediCode};
    axios
      .post('/showBarcode', sendParam)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // MRP 블록체인 네트워크 연결요청
  connect = () => {
    axios
      .get('/connect')
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 전문의약품 유통정보 등록
  register = () => {
    const flag = confirm(
      `아래 정보로 입력하시겠습니까?\n표준코드 : ${this.barcodeInput.value}\n회사코드: ${this.companyIdInput.value}\n대상업체코드: ${this.targetIdInput.value}\n유통상태: ${this.productStateInput.value}`
    );
    if (flag) {
      const sendParam = {
        barcode: this.barcodeInput.value,
        companyId: this.companyIdInput.value,
        targetId: this.targetIdInput.value,
        state: this.productStateInput.value,
      };
      axios
        .post('/register', sendParam)
        .then((response) => {
          alert(response.data.msg);
          this.barcodeInput.value = '';
          this.companyIdInput.value = '';
          this.targetIdInput.value = '';
          this.productStateInput.value = '입고';
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  };

  // 기존 등록된 전문의약품의 최신 유통정보 등록요청
  update = () => {
    const flag = confirm(
      `아래 정보로 입력하시겠습니까?\n(기존 유통되지 않은 전문의약품은 등록불가)\n표준코드 : ${this.barcodeUpdate.value}\n회사코드: ${this.companyIdUpdate.value}\n대상업체코드: ${this.targetIdUpdate.value}\n유통상태: ${this.productStateUpdate.value}`
    );
    if (flag) {
      const sendParam = {
        barcode: this.barcodeUpdate.value,
        companyId: this.companyIdUpdate.value,
        targetId: this.targetIdUpdate.value,
        state: this.productStateUpdate.value,
      };
      axios
        .post('/update', sendParam)
        .then((response) => {
          alert(response.data.msg);
          this.barcodeUpdate.value = '';
          this.companyIdUpdate.value = '';
          this.targetIdUpdate.value = '';
          this.productStateUpdate.value = '입고';
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return;
    }
  };

  // 특정 전문의약품의 모든 유통이력 조회요청
  historyForMedicine = () => {
    alert(this.barcodeQeury.value);
    const barcode = { barcode: this.barcodeQeury.value };

    axios
      .post('/history', barcode)
      .then((response) => {
        const str = [];
        const history = response.data.history;
        const iter = response.data.history.length;
        for (let i = 0; i < iter; i++) {
          str.push(history[i].Value);
        }
        this.setState({ history: str });
        console.log(this.state.history);
        this.barcodeQeury.value = '';
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 하나의 바코드 정보로 유통이력 조회요청 (world state)
  getBarcode = () => {
    alert(this.barcodeInfo.value);
    const barcode = { barcode: this.barcodeInfo.value };
    axios
     .post('/getBarcode', barcode)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.showMediData}>전문의약품 목록 조회</button>
        <table style={{ border: '1px solid black' }}>
          <thead>
            <tr>
              <th>표준코드</th>
              <th>의약품명</th>
              <th>유형</th>
              <th>수량</th>
              <th>허가일자</th>
              <th>취소일자</th>
              <th>업데이트일자</th>
            </tr>
          </thead>
          <tbody>{this.state.mediData}</tbody>
        </table>
        <hr />
        <button onClick={this.connect}>
          네트워크 연결
        </button>
        <br />
        <input
          placeholder="barcode"
          ref={(ref) => {
            this.barcodeInput = ref;
          }}
        />
        <input
          placeholder="companyCode"
          ref={(ref) => {
            this.companyIdInput = ref;
          }}
        />
        <input
          placeholder="targetCompanyCode"
          ref={(ref) => {
            this.targetIdInput = ref;
          }}
        />
        <select
          ref={(ref) => {
            this.productStateInput = ref;
          }}
          onChange={this.handleChange}
        >
          <option>입고</option>
          <option>출고</option>
        </select>
        <button onClick={this.register}>
          전문의약품 유통정보 등록 (최초 유통시작)
        </button>
        <br />
        <input
          placeholder="barcode"
          ref={(ref) => {
            this.barcodeUpdate = ref;
          }}
        />
        <input
          placeholder="companyCode"
          ref={(ref) => {
            this.companyIdUpdate = ref;
          }}
        />
        <input
          placeholder="targetCompanyCode"
          ref={(ref) => {
            this.targetIdUpdate = ref;
          }}
        />
        <select
          ref={(ref) => {
            this.productStateUpdate = ref;
          }}
          onChange={this.handleChange}
        >
          <option>입고</option>
          <option>출고</option>
          <option>반송</option>
        </select>
        <button onClick={this.update}>
          전문의약품 유통정보 등록 (도매, 병원 및 약국)
        </button>
        <br />
        <br />

        <div>{this.state.comments}</div>

        <br />
        <input
          placeholder="barcodeName"
          ref={(ref) => (this.barcodeQeury = ref)}
        />
        <button onClick={this.historyForMedicine}>유통이력 보기</button>< br/>
	<input placeholder="barcodeName" ref={(ref) => (this.barcodeInfo = ref)} />
	<button onClick={this.getBarcode}>현재상태 보기</button>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));
