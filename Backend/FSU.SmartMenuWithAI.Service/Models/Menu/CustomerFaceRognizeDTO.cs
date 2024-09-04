using Amazon.Rekognition.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FSU.SmartMenuWithAI.Service.Models.Menu
{
    public class CustomerFaceRognizeDTO
    {
        public int Age { get; set; } = -1;
        public List<Emotion>? Emotions { get; set; }
        public string? Gender { get; set; }
        public string? Session {  get; set; }
    }
}
