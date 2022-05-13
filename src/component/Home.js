import React, { useEffect, useState } from 'react'
import axios from "axios"


const Home = () => {

    const [val, setVal] = useState({
        UserId: "",
        name: "",
        email: "",
        salary: "",
        designation: ""


    });

    const [tval, settVal] = useState([{
        user_id: "",
        name: "",
        email: "",
        salary: "",
        designation: ""


    }]);

    const [psdata, setPsData] = useState([]);

    const [isUpdate, setIsUpdate] = useState(false);



    const editEmployee = (tdata) => {
        console.log(tdata)
        const upEmployee = {
            UserId: tdata.user_id,
            name: tdata.name,
            email: tdata.email,
            salary: tdata.salary,
            designation: tdata.designation
        }

        if (upEmployee !== null) {
            setVal(upEmployee);
            setIsUpdate(true);
        }
    }

    const deleteEmployee = async (tdata) => {
        console.log(tdata)
        const dEmp = {
            UserId: tdata.user_id,
        }
        const res = await axios.post("http://localhost:5000/deleteUserById", dEmp, { Headers: { 'Content-Type': 'application/json' } })
        console.log(res);
        if (res.status === 200) {
            window.alert("Employee has been deleted");
            const deleteEmployee = tval.findIndex((o) => {
                return o.user_id === tdata.user_id;
            });
            tval.splice(deleteEmployee, 1)
        }
        if (dEmp !== null) {
            setVal(dEmp);
            setIsUpdate(true);
        }
    }



    useEffect(() => {
        axios.post("http://localhost:5000/getAllUser", { Headers: { 'Content-Type': 'application/json' } })
            .then((result) => {
                console.log(result)
                const newData = result.data.map((res) => {
                    return {
                        user_id: res._id,
                        name: res.name,
                        email: res.email,
                        salary: res.salary,
                        designation: res.designation
                    }
                });
                setPsData(newData);
                settVal(newData);
                console.log(tval);
            }).catch((err) => {
                console.log(err);
            })
    }, []);


    const setdata = (e) => {
        console.log(e.target.value);
        const { name, value } = e.target;
        setVal((state) => {
            return {
                ...state,
                [name]: value
            }
        })

    }

    const addEmployee = async (e) => {
        e.preventDefault();
        console.log(val);


        if (isUpdate) {
            const res = await axios.post("http://localhost:5000/updateUserByID", val, { Headers: { 'Content-Type': 'application/json' } })
            console.log(res);
            if (res.status === 200) {

                tval.forEach((nd) => {
                    if (nd.user_id == res.data._id) {

                        nd.user_id = res.data._id;
                        nd.name = res.data.name;
                        nd.email = res.data.email;
                        nd.salary = res.data.salary;
                        nd.designation = res.data.designation;

                    }
                })

                window.alert("Employee has been updated");
                setVal({
                    name: "",
                    email: "",
                    salary: "",
                    designation: ""

                });
                setIsUpdate(false);
            }
        } else {
            const res = await axios.post("http://localhost:5000/createUser", val, { Headers: { 'Content-Type': 'application/json' } })
            console.log(res);
            if (res.status === 200) {
                const newEmployee = {
                    user_id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                    salary: res.data.salary,
                    designation: res.data.designation
                }

                tval.unshift(newEmployee);


                window.alert("Employee has been created");
                setVal({
                    name: "",
                    email: "",
                    salary: "",
                    designation: ""

                })
            }

        }

    }

    const searchEmployee = (val) => {

        // console.log(val);
        // if (val === "" || val === null) {
        //     settVal(psdata);
        // }
        // const searchData = tval.filter((data) => {
        //     return (data.name.includes(val) || data.email.includes(val) || data.designation.includes(val));
        // });
        // settVal(searchData);
        const myTable = document.getElementById("employeetable");
        const searchRow = myTable.getElementsByTagName("tr");
        let i = 0;
        for (i = 0; i < searchRow.length; i++) {
            var td = searchRow[i].getElementsByTagName("td")[0];
            var td1 = searchRow[i].getElementsByTagName("td")[1];
            var td2 = searchRow[i].getElementsByTagName("td")[2];
            var td3 = searchRow[i].getElementsByTagName("td")[3];
            if (td || td1 || td2 || td3) {
                var txtValue = td.textContent || td.innertext;
                var txtValue1 = td1.textContent || td1.innertext;
                var txtValue2 = td2.textContent || td2.innertext;
                var txtValue3 = td3.textContent || td3.innertext;
                if (txtValue.toUpperCase().indexOf(val.toUpperCase()) > -1 || txtValue1.toUpperCase().indexOf(val.toUpperCase()) > -1 || txtValue2.toUpperCase().indexOf(val.toUpperCase()) > -1 || txtValue3.toUpperCase().indexOf(val.toUpperCase()) > -1) {
                    searchRow[i].style.display = "";
                } else {
                    searchRow[i].style.display = "none";
                }
            }
        }



    }



    return (
        <>
            <div className="container">
                <form onSubmit={addEmployee}>
                    <div className="user_detail d-flex flex-column mt-3 ">
                        <div className="d-flex inputs py-2">   <p >Name:</p> <input type="text" className="ms-5" onChange={setdata} value={val.name} name="name"></input></div>
                        <div className="d-flex inputs py-2">   <p >Email:</p> <input type="email" className="ms-5" onChange={setdata} value={val.email} name="email"></input></div>
                        <div className="d-flex inputs py-2">   <p >Salary:</p> <input type="number" className="ms-5" onChange={setdata} value={val.salary} name="salary"></input></div>
                        <div className="d-flex inputs py-2">  <p >Designation:        </p>
                            <select className="ms-5" onChange={setdata} value={val.designation} name="designation">
                                <option value="" selected disabled hidden>Select</option>
                                <option >Frontend Developer</option>
                                <option >Backend Developer</option>
                                <option >MERN Stack Developer</option>
                                <option >MEAN Developer</option>
                            </select></div>
                        <button type="submit" className="btn" >Submit</button>

                    </div>
                </form>

                <div className="form_detail">
                    <div className="search_div">
                        <div className="d-flex inputs py-2 ">   <p >Search:</p> <input type="text" className="ms-2" onChange={(e) => searchEmployee(e.target.value)}></input></div>
                    </div>
                    <table className="table table-bordered mt-2" id="employeetable">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Salary</th>
                                <th scope="col">Designation</th>
                                <th scope="col" >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tval && tval.map((tdata) => {
                                return (
                                    <tr>
                                        <td>{tdata.name}</td>
                                        <td>{tdata.email}</td>
                                        <td>{tdata.salary}</td>
                                        <td>{tdata.designation}</td>
                                        <td className='edit_delete_btn'>
                                            <button onClick={() => editEmployee(tdata)}>Edit</button>  <button onClick={() => deleteEmployee(tdata)}>Delete</button>

                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default Home