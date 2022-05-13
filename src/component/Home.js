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
        // setVal(upEmployee);
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

            // const editedEmployee = {

            // }
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

                })
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
                                <option value="" selected disabled hidden>Choose here</option>
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
                        <div className="d-flex inputs py-2 ">   <p >Search:</p> <input type="text" className="ms-2"></input></div>
                    </div>
                    <table class="table table-bordered mt-2">
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
                                            <button onClick={() => editEmployee(tdata)}>Edit</button>  <button>Delete</button>

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