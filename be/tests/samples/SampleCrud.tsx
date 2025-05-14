import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function formatDate(date) {
  return date ? new Date(date).toISOString().split("T")[0] : "";
}

function SampleCrud() {
  const url = "http://localhost:8080/api";

  const [data, setData] = useState({
    title: "BUDGET TITLE HERE!",
    date: "2025-01-01",
    // image: null,
    file: null,
    barangayId: "681f5663bc1cafa5099611e3",
  });

  const [list, setList] = useState([]);
  const [updateId, setUpdateId] = useState(null);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    // const res = await axios.get(`${url}/news-announcements`);
    // const res = await axios.get(`${url}/projects`);
    // const res = await axios.get(`${url}/accomplishments-achievements`);
    const res = await axios.get(`${url}/budgets`);
    setList(res.data.data || []);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // if (name === "image") {
    //   setData({ ...data, image: files[0] });
    // } else {
    //   setData({ ...data, [name]: value });
    // }
    if (name === "file") {
      setData({ ...data, file: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ! NOTE: IF UPDATING, YOU NEED TO SEND AGAIN THE ORIGINAL IMAGES
    // ! IF NO IMAGES UPLOADED, IT WILL BE CONSIDERED AS NULL
    // ! AND THE FILE ON BACKEND WILL BE DELETED
    // ! NO IMAGE = DELETED FILE
    const formData = new FormData();
    for (const key in data) {
      // if (key === "image") {
      //   if (data.image) {
      //     formData.append("image", data.image);
      //   }
      // } else {
      //   formData.append(key, data[key]);
      // }
      if (key === "file") {
        if (data.file) {
          formData.append("file", data.file);
        }
      } else {
        formData.append(key, data[key]);
      }
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      if (updateId) {
        // const res = await axios.put(
        //   `${url}/news-announcements/${updateId}`,
        //   formData,
        //   config
        // );
        // const res = await axios.put(
        //   `${url}/projects/${updateId}`,
        //   formData,
        //   config
        // );
        // const res = await axios.put(
        //   `${url}/accomplishments-achievements/${updateId}`,
        //   formData,
        //   config
        // );
        const res = await axios.put(
          `${url}/budgets/${updateId}`,
          formData,
          config
        );
        alert(res.data.message);
      } else {
        // const res = await axios.post(
        //   `${url}/news-announcements`,
        //   formData,
        //   config
        // );
        // const res = await axios.post(
        //   `${url}/projects`,
        //   formData,
        //   config
        // );
        // const res = await axios.post(
        //   `${url}/accomplishments-achievements`,
        //   formData,
        //   config
        // );
        const res = await axios.post(
          `${url}/budgets`,
          formData,
          config
        );
        alert(res.data.message);
      }

      await fetchList();
      setUpdateId(null);
    } catch (error) {
      console.error(error);
      alert("Submission failed");
    }
  };

  const onEditClick = async (id) => {
    // const newsAnnouncements = list.find((u) => u._id === id);
    // if (newsAnnouncements) {
    //   setData({
    //     title: newsAnnouncements.title,
    //     contents: newsAnnouncements.contents,
    //     date: newsAnnouncements.date,
    //     image: newsAnnouncements.image,
    //   });
    //   setUpdateId(newsAnnouncements._id);
    // }
    const budget = list.find((u) => u._id === id);
    try {
      const response = await axios.get(`${url}/files/` + budget.file);
      const blob = await response.blob();
      const file = new File([blob], budget.file, { type: blob.type });

      if (budget) {
        setData({
          title: budget.title,
          // contents: budget.contents,
          date: budget.date,
          file: file,
          barangayId: budget.barangayId,
        });
      }
    } catch (ex) {
      alert("N/A FILE!");
      if (budget) {
        setData({
          title: budget.title,
          // contents: budget.contents,
          date: budget.date,
          file: budget.file,
          barangayId: budget.barangayId,
        });
      }
    }
    setUpdateId(budget._id);
  };

  const onRemoveClick = async (id) => {
    if (window.confirm("Are you sure?")) {
      // const res = await axios.delete(`${url}/news-announcements/${id}`);
      // const res = await axios.delete(
      //   `${url}/accomplishments-achievements/${id}`
      // );
      const res = await axios.delete(
        `${url}/budgets/${id}`
      );
      alert(res.data.message);
      await fetchList();
    }
  };

  return (
    <>
      <h1>Management</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>title</label>
        <input
          name="title"
          value={data.title}
          onChange={handleChange}
          required
        />

        {/* <label>contents</label>
        <input
          name="contents"
          value={data.contents}
          onChange={handleChange}
          required
        /> */}
        <label>brgy id</label>
        <input
          name="barangayId"
          value={data.barangayId}
          onChange={handleChange}
          required
        />

        <label>date</label>
        <input
          type="date"
          name="date"
          value={formatDate(data.date)}
          onChange={handleChange}
          required
        />

        {/* <label>image</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
        /> */}
        <label>file</label>
        <input
          type="file"
          name="file"
          onChange={handleChange}
          accept="file/*"
        />

        <button type="submit">{updateId ? "Update" : "Create"}</button>
      </form>

      <h2>List</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>title</th>
            {/* <th>contents</th> */}
            <th>date</th>
            {/* <th>image</th> */}
            <th>file</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((data) => (
              <tr key={data._id}>
                <td>{data.title}</td>
                {/* <td>{data.contents}</td> */}
                <td>{data.date}</td>
                {/* <td>
                  <p>{data.image}</p>
                  {data.image !== "N/A" && (
                    <img
                      src={`${url}/images/${data.image}`}
                      alt="user"
                      width={100}
                      height={100}
                    />
                  )}
                </td> */}
                <td>
                  <p>{data.file}</p>
                  {data.file !== "N/A" && (
                    <a
                      href={`${url}/files/${data.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📥 View/Download Excel File
                    </a>
                  )}
                </td>
                <td>
                  <button onClick={() => onEditClick(data._id)}>Edit</button>
                  <button onClick={() => onRemoveClick(data._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

// function SampleCrud() {
//   const url = "http://localhost:8080/api";

//   const [userData, setUserData] = useState({
//     firstName: "Juan",
//     lastName: "Dela Cruz",
//     sex: "Male",
//     birthdate: "2000-05-15",
//     age: 24,
//     email: "juan.user@example.com",
//     phoneNumber: "0987654321",
//     password: "userpass123",
//     address: "123 North St",
//     profile: null,
//     validId: {
//       type: "N/A",
//       front: null,
//       back: null,
//     },
//     role: "user",
//     barangayId: "681f5663bc1cafa5099611e3",
//   });

//   const [userList, setUserList] = useState([]);
//   const [updateId, setUpdateId] = useState(null);

//   useEffect(() => {
//     fetchList();
//   }, []);

//   const fetchList = async () => {
//     const res = await axios.get(`${url}/users`);
//     setUserList(res.data.data || []);
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "profile") {
//       setUserData({ ...userData, profile: files[0] });
//     } else if (name.startsWith("validId.")) {
//       const key = name.split(".")[1];
//       setUserData((prev) => ({
//         ...prev,
//         validId: {
//           ...prev.validId,
//           [key]: files ? files[0] : value,
//         },
//       }));
//     } else {
//       setUserData({ ...userData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // ! NOTE: IF UPDATING, YOU NEED TO SEND AGAIN THE ORIGINAL IMAGES
//     // ! IF NO IMAGES UPLOADED, IT WILL BE CONSIDERED AS NULL
//     // ! AND THE FILE ON BACKEND WILL BE DELETED
//     // ! NO IMAGE = DELETED FILE
//     const formData = new FormData();
//     for (const key in userData) {
//       if (key === "validId") {
//         formData.append("validId[type]", userData.validId.type);

//         if (userData.validId.front) {
//           formData.append("front", userData.validId.front);
//         }
//         if (userData.validId.back) {
//           formData.append("back", userData.validId.back);
//         }
//       } else if (key === "profile") {
//         if (userData.profile) {
//           formData.append("profile", userData.profile);
//         }
//       } else {
//         formData.append(key, userData[key]);
//       }
//     }

//     const config = {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     };

//     try {
//       if (updateId) {
//         const res = await axios.put(
//           `${url}/users/${updateId}`,
//           formData,
//           config
//         );
//         alert(res.data.message);
//       } else {
//         const res = await axios.post(`${url}/users`, formData, config);
//         alert(res.data.message);
//       }

//       await fetchList();
//       setUpdateId(null);
//     } catch (error) {
//       console.error(error);
//       alert("Submission failed");
//     }
//   };

//   const onEditClick = (id) => {
//     setUserData({
//       ...userData,
//       profile: null,
//       validId: {
//         ...userData.validId,
//         front: null,
//         back: null,
//       },
//     });
//     const user = userList.find((u) => u._id === id);
//     if (user) {
//       setUserData({
//         firstName: user.firstName,
//         lastName: user.lastName,
//         sex: user.sex,
//         birthdate: formatDate(user.birthdate),
//         age: user.age,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         password: user.password,
//         address: user.address,
//         profile: null,
//         validId: {
//           type: user.validId?.type || "N/A",
//           front: null,
//           back: null,
//         },
//         role: user.role,
//         barangayId: user.barangayId,
//       });
//       setUpdateId(user._id);
//     }
//   };

//   const onRemoveClick = async (id) => {
//     if (window.confirm("Are you sure?")) {
//       const res = await axios.delete(`${url}/users/${id}`);
//       alert(res.data.message);
//       await fetchList();
//     }
//   };

//   return (
//     <>
//       <h1>User Management</h1>
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <label>First Name</label>
//         <input
//           name="firstName"
//           value={userData.firstName}
//           onChange={handleChange}
//           required
//         />

//         <label>Last Name</label>
//         <input
//           name="lastName"
//           value={userData.lastName}
//           onChange={handleChange}
//           required
//         />

//         <label>Sex</label>
//         <select
//           name="sex"
//           value={userData.sex}
//           onChange={handleChange}
//           required
//         >
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//         </select>

//         <label>Birthdate</label>
//         <input
//           type="date"
//           name="birthdate"
//           value={formatDate(userData.birthdate)}
//           onChange={handleChange}
//           required
//         />

//         <label>Age</label>
//         <input
//           type="number"
//           name="age"
//           value={userData.age}
//           onChange={handleChange}
//           required
//         />

//         <label>Email</label>
//         <input
//           name="email"
//           value={userData.email}
//           onChange={handleChange}
//           required
//         />

//         <label>Phone Number</label>
//         <input
//           name="phoneNumber"
//           value={userData.phoneNumber}
//           onChange={handleChange}
//           required
//         />

//         <label>Password</label>
//         <input
//           type="password"
//           name="password"
//           value={userData.password}
//           onChange={handleChange}
//           required
//         />

//         <label>Address</label>
//         <input
//           name="address"
//           value={userData.address}
//           onChange={handleChange}
//           required
//         />

//         <label>Profile Picture</label>
//         <input
//           type="file"
//           name="profile"
//           onChange={handleChange}
//           accept="image/*"
//         />

//         <label>Valid ID Type</label>
//         <input
//           name="validId.type"
//           value={userData.validId.type}
//           onChange={handleChange}
//         />

//         <label>Valid ID Front</label>
//         <input
//           type="file"
//           name="validId.front"
//           onChange={handleChange}
//           accept="image/*"
//         />

//         <label>Valid ID Back</label>
//         <input
//           type="file"
//           name="validId.back"
//           onChange={handleChange}
//           accept="image/*"
//         />

//         <label>Role</label>
//         <input
//           name="role"
//           value={userData.role}
//           onChange={handleChange}
//           required
//         />

//         <label>Barangay ID</label>
//         <input
//           name="barangayId"
//           value={userData.barangayId}
//           onChange={handleChange}
//           required
//         />

//         <button type="submit">
//           {updateId ? "Update User" : "Create User"}
//         </button>
//       </form>

//       <h2>User List</h2>
//       <table border={1}>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>profile</th>
//             <th>id front</th>
//             <th>id back</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {userList.length > 0 ? (
//             userList.map((user) => (
//               <tr key={user._id}>
//                 <td>
//                   {user.firstName} {user.lastName}
//                 </td>
//                 <td>{user.email}</td>
//                 <td>
//                   <p>{user.profile}</p>
//                   {user.profile !== "N/A" && (
//                     <img
//                       src={`${url}/images/${user.profile}`}
//                       alt="user"
//                       width={100}
//                       height={100}
//                     />
//                   )}
//                 </td>
//                 <td>
//                   <p>{user.validId.front}</p>
//                   {user.validId.front !== "N/A" && (
//                     <img
//                       src={`${url}/images/${user.validId.front}`}
//                       alt="user"
//                       width={100}
//                       height={100}
//                     />
//                   )}
//                 </td>
//                 <td>
//                   <p>{user.validId.back}</p>
//                   {user.validId.back !== "N/A" && (
//                     <img
//                       src={`${url}/images/${user.validId.back}`}
//                       alt="user"
//                       width={100}
//                       height={100}
//                     />
//                   )}
//                 </td>
//                 <td>
//                   <button onClick={() => onEditClick(user._id)}>Edit</button>
//                   <button onClick={() => onRemoveClick(user._id)}>
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={5}>No users found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </>
//   );
// }

export default SampleCrud;
