import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { useBarangay } from "../../providers/BarangayProvider";
import axios from "axios";
import Modal from "../../components/Modal";
import DeleteModal from "../../components/DeleteModal";
import { useNavigate } from "react-router-dom";
import { RiAddLine, RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import BACKEND_API from "../../utils/API";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [profile, setProfile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [idType, setIdType] = useState("");

  const [edit, setEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { barangays, getBarangays } = useBarangay();
  const [userId, setUserId] = useState("");

  const [deleteModal, showDeleteModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    getBarangays();
  }, []);

  const deleteUser = async () => {
    if (userId) {
      try {
        let url = `${BACKEND_API}/users/${userId}`;
        // let url = `http://localhost:8080/api/users/${userId}`;

        let response = await axios.delete(url);

        if (response.data.success === true) {
          navigate("/");
          localStorage.removeItem("user");
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const updateAdmin = async () => {
    try {
      let url = `${BACKEND_API}/users/${userId}`;
      // let url = `http://localhost:8080/api/users/${userId}`;

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("middleName", middleName);
      formData.append("lastName", lastName);
      formData.append("sex", sex);
      formData.append("birthdate", birthDate);
      formData.append("age", age);
      formData.append("email", email);
      formData.append("phoneNumber", mobileNumber);
      formData.append("address", address);
      profile && formData.append("profile", profile);
      formData.append("role", "admin");
      formData.append("barangayId", barangay);
      password && formData.append("password", password);
      formData.append("type", idType);
      back && formData.append("back", back);
      front && formData.append("front", front);

      const response = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success === true) {
        console.log(response.data);
        setShowModal(true);
        setMessage(response.data.message);
        setError(false);
        setEdit(false);
      }
    } catch (error: any) {
      console.log(error.response.data);
      setEdit(false);
      setError(true);
      setMessage(error.response.data.message);
      setShowModal(true);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const user = localStorage.getItem("user");

      if (user) {
        const currUser = JSON.parse(user);

        if (currUser) {
          console.log(currUser);
          try {
            let url = `${BACKEND_API}/users/${currUser._id}`;
            // let url = `http://localhost:8080/api/users/${currUser._id}`;

            let response = await axios.get(url);

            if (response.data.success === true) {
              setFirstName(response.data.data.firstName);
              setMiddleName(response.data.data.middleName);
              setLastName(response.data.data.lastName);
              setMobileNumber(response.data.data.phoneNumber);
              setEmail(response.data.data.email);
              setAddress(response.data.data.address);
              setBarangay(response.data.data.barangayId);
              setAge(response.data.data.age);
              setSex(response.data.data.sex);
              setProfile(response.data.data.profile);
              setUserId(response.data.data._id);
              setFront(response.data.data.validId.front);
              setBack(response.data.data.validId.back);
              setIdType(response.data.data.validId.type);
              const isoDate = response.data.data.birthdate;
              const formattedDate = isoDate ? isoDate.split("T")[0] : "";
              setBirthDate(formattedDate);
            }
          } catch (error: any) {
            console.log(error);
          }
        }
      }
    };

    getUser();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex flex-col lg:flex-row items-center justify-center">
        <div className="hidden lg:flex w-[100px]"></div>
        <div className="w-full min-h-screen flex items-center justify-center px-4 py-6">
          <div className="w-full lg:w-2/4 flex flex-col items-center justify-center bg-white p-6 gap-6 rounded-2xl shadow-xl shadow-black/20">
            {/* edit */}
            <div className="w-full flex flex-row items-center justify-end">
              {edit ? (
                <>
                  <div
                    className="p-2 rounded-xl bg-red-700 text-sm font-normal text-white cursor-pointer mr-2"
                    onClick={() => showDeleteModal(true)}
                  >
                    Delete
                  </div>
                  <div
                    className="p-2 rounded-xl bg-green-700 text-sm font-normal text-white cursor-pointer mr-2"
                    onClick={() => {
                      setEdit(false);
                      window.location.reload();
                    }}
                  >
                    Cancel
                  </div>
                  <div
                    className="p-2 rounded-xl bg-green-700 text-sm font-normal text-white cursor-pointer"
                    onClick={() => updateAdmin()}
                  >
                    Save
                  </div>
                </>
              ) : (
                <div
                  className="p-2 rounded-xl bg-green-700 text-sm font-normal text-white cursor-pointer"
                  onClick={() => setEdit(true)}
                >
                  Edit Profile
                </div>
              )}
            </div>
            {/* image */}
            <div className="w-full flex flex-row items-center justify-start gap-4">
              <div className="relative rounded-full">
                <div className="w-[80px] h-[80px] lg:w-[120px] lg:h-[120px] bg-gray-200 overflow-hidden rounded-full">
                  {profile ? (
                    <img
                      src={
                        preview
                          ? preview
                          : profile
                          ? `${BACKEND_API}/images/${profile}`
                          : ""
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                {edit ? (
                  <>
                    <label
                      htmlFor="profileInput"
                      className="absolute p-2 rounded-md bg-[#008A3D] right-1 bottom-1 cursor-pointer"
                    >
                      <RiAddLine size={16} color="white" />
                    </label>
                    <input
                      id="profileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileChange}
                      className="hidden"
                    />
                  </>
                ) : null}
              </div>
              <div className="flex flex-col items-start justify-center">
                <p className="text-sm font-semibold">{firstName}</p>
                <p className="text-sm font-normal">{email}</p>
                <div className="p-2 rounded-xl bg-yellow-500 mt-2">
                  <p className="text-sm font-normal">Admin</p>
                </div>
              </div>
            </div>
            {/* fields */}
            <div className="w-full flex flex-col items-center justify-center gap-4">
              {/* first name */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">First Name</p>
                <input
                  type="text"
                  className="w-full text-sm font-normal outline-none border border-green-700 rounded-xl p-3"
                  placeholder="first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={true}
                />
              </div>
              {/* middle name */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Middle Name</p>
                <input
                  type="text"
                  className="w-full text-sm font-normal outline-none border border-green-700 rounded-xl p-3"
                  placeholder="middle name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  disabled={true}
                />
              </div>
              {/* last name */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Last Name</p>
                <input
                  type="text"
                  className="w-full text-sm font-normal outline-none border border-green-700 rounded-xl p-3"
                  placeholder="last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={true}
                />
              </div>
              {/* mobile num */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Mobile Number</p>
                <input
                  type="text"
                  className="w-full text-sm font-normal outline-none border border-green-700 rounded-xl p-3"
                  placeholder="mobile number"
                  value={mobileNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setMobileNumber(value.slice(0, 11));
                  }}
                  disabled={edit ? false : true}
                />
              </div>
              {/* email */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Email</p>
                <input
                  type="text"
                  className="w-full text-sm font-normal outline-none border border-green-700 rounded-xl p-3"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={true}
                />
              </div>
              {/* street */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Address</p>
                <input
                  type="text"
                  className="w-full text-sm font-normal outline-none border border-green-700 rounded-xl p-3"
                  placeholder="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={edit ? false : true}
                />
              </div>
              {/* barangay */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Barangay</p>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full p-3 rounded-xl outline-none border border-[#008A3D] text-sm font-normal"
                  disabled={edit ? false : true}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {barangays &&
                    barangays.map((barangay: any) => (
                      <option value={barangay._id} key={barangay._id}>
                        {barangay.barangayName}
                      </option>
                    ))}
                </select>
              </div>
              {/* birthdate */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Birth Date</p>
                <input
                  type="date"
                  className="w-full text-sm font-normal outline-none border border-green-700 rounded-xl p-3"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  disabled={true}
                />
              </div>
              {/* age */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Age</p>
                <input
                  type="text"
                  className="w-full text-sm font-normal outline-none border border-green-700 rounded-xl p-3"
                  placeholder="age"
                  value={age}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setAge(value.slice(0, 2));
                  }}
                  disabled={true}
                />
              </div>
              {/* sex */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Sex</p>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full p-3 rounded-xl outline-none border border-[#008A3D] text-sm font-normal"
                  // disabled={edit ? false : true}
                  disabled={true}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              {/* password */}
              <div className="w-full flex flex-col items-start justify-center gap-2">
                <p className="text-sm font-normal">Password</p>
                <div className="w-full flex flex-row relative items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full text-sm font-normal outline-none border border-green-700 rounded-xl p-3"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={edit ? false : true}
                  />
                  {showPassword ? (
                    <RiEyeLine
                      className="absolute right-4 cursor-pointer"
                      size={12}
                      color="black"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <RiEyeCloseLine
                      className="absolute right-4 cursor-pointer"
                      size={12}
                      color="black"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex lg:hidden w-full h-[100px]"></div>
      </div>
      {showModal && (
        <Modal
          error={error}
          message={message}
          onClose={() => setShowModal(false)}
        />
      )}
      {deleteModal && (
        <DeleteModal
          onDelete={() => deleteUser()}
          onClose={() => showDeleteModal(false)}
        />
      )}
    </>
  );
};

export default Profile;
