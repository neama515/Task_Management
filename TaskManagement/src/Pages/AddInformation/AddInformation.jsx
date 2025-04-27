import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Button, Textarea } from 'flowbite-react';
import styles from '../../CSS/Authenticate/SignPages.module.scss';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AddInformation() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setErrors }) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      console.log('Form Data:', values);

      const { data } = await axios.post(
        'http://localhost:5017/api/Profile/AddInformation',
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Success:', data);
      navigate('/profile');
    } catch (error) {
      console.error('Error:', error.response?.data);
      setErrors({ api: error.response?.data || 'Submission failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const formikRegister = useFormik({
    initialValues: {
      jobRole: '',
      gender: '',
      birthDate: '',
      phoneNumber: '',
      aboutMe: '',
      experiences: [{ name: '', title: '', startDate: '', endDate: '' }],
      skills: [{ name: '' }],
    },
    onSubmit: handleSubmit,
  });

  return (
    <div className={styles.sign_up_container}>
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg">
        <h2 className={`text-2xl font-bold text-black text-center ${styles.primary_text_sign}`}>
          Tell Us About Yourself
        </h2>
        <form onSubmit={formikRegister.handleSubmit} className="space-y-4">
          <input
            type="text"
            name="jobRole"
            placeholder="Job Role"
            value={formikRegister.values.jobRole}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            className={styles.inputField_pass}
          />

          <div>
            <label className={styles.Infolabel}>Gender</label>
            <div className="flex space-x-4">
              <label className={styles.helper_txt_sign}>
                <input
                  type="radio"
                  name="gender"
                  className="w-3 h-3 text-[#639eb0] focus:ring-0"
                  value="0"
                  checked={formikRegister.values.gender === '0'}
                  onChange={() => formikRegister.setFieldValue('gender', '0')}
                />{' '}
                Male
              </label>
              <label className={styles.helper_txt_sign}>
                <input
                  type="radio"
                  name="gender"
                  className="w-3 h-3 text-[#639eb0] focus:ring-0"
                  value="1"
                  checked={formikRegister.values.gender === '1'}
                  onChange={() => formikRegister.setFieldValue('gender', '1')}
                />{' '}
                Female
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="date"
              name="birthDate"
              value={formikRegister.values.birthDate}
              onChange={formikRegister.handleChange}
              onBlur={formikRegister.handleBlur}
              className={styles.inputField_pass}
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone"
              value={formikRegister.values.phoneNumber}
              onChange={formikRegister.handleChange}
              onBlur={formikRegister.handleBlur}
              className={styles.inputField_pass}
            />
          </div>

          <Textarea
            name="aboutMe"
            placeholder="About Me"
            value={formikRegister.values.aboutMe}
            onChange={formikRegister.handleChange}
            onBlur={formikRegister.handleBlur}
            className={styles.inputField_pass}
          />

          {/* Experience Section */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className={styles.Infolabel}>Experience</h2>
              <button
                type="button"
                onClick={() =>
                  formikRegister.setFieldValue('experiences', [
                    ...formikRegister.values.experiences,
                    { name: '', title: '', startDate: '', endDate: '' },
                  ])
                }
                className="flex items-center mr-30"
              >
                <span className={styles.InfoPlus}>Add Experience</span>
                <Plus className="text-[#87C2D4]" size={16} />
              </button>
            </div>
            {formikRegister.values.experiences.map((experience, index) => (
              <div key={index}>
                <input
                  type="text"
                  name={`experiences[${index}].name`}
                  placeholder="Experience Name"
                  value={experience.name}
                  onChange={formikRegister.handleChange}
                  onBlur={formikRegister.handleBlur}
                  className={styles.inputField_pass}
                />
                <input
                  type="text"
                  name={`experiences[${index}].title`}
                  placeholder="Experience Title"
                  value={experience.title}
                  onChange={formikRegister.handleChange}
                  onBlur={formikRegister.handleBlur}
                  className={styles.inputField_pass}
                />
                <input
                  type="date"
                  name={`experiences[${index}].startDate`}
                  value={experience.startDate}
                  onChange={formikRegister.handleChange}
                  onBlur={formikRegister.handleBlur}
                  className={styles.inputField_pass}
                />
                <input
                  type="date"
                  name={`experiences[${index}].endDate`}
                  value={experience.endDate}
                  onChange={formikRegister.handleChange}
                  onBlur={formikRegister.handleBlur}
                  className={styles.inputField_pass}
                />
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className={styles.Infolabel}>Skills</h2>
              <button
                type="button"
                onClick={() =>
                  formikRegister.setFieldValue('skills', [
                    ...formikRegister.values.skills,
                    { name: '' },
                  ])
                }
                className="flex items-center mr-30"
              >
                <span className={styles.InfoPlus}>Add Skills</span>
                <Plus className="text-[#87C2D4]" size={16} />
              </button>
            </div>
            {formikRegister.values.skills.map((skill, index) => (
              <input
                key={index}
                type="text"
                name={`skills[${index}].name`}
                placeholder="Skill"
                value={skill.name}
                onChange={formikRegister.handleChange}
                onBlur={formikRegister.handleBlur}
                className={styles.inputField_pass}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.sign_btn} flex items-center justify-center`}
          >
            {isLoading ? <FaSpinner className="animate-spin" size={20} /> : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
